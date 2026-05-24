import prisma from '../../db.ts';
import { logger } from '../../lib/logger.ts';
import Stripe from 'stripe';
import { advisePayment } from '../../lib/lumos.ts';
import { PaymentStatus } from '@prisma/client';

let stripeClient: Stripe | null = null;

export function getStripe(): Stripe {
  if (!stripeClient) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) {
      throw new Error('STRIPE_SECRET_KEY environment variable is required');
    }
    stripeClient = new Stripe(key);
  }
  return stripeClient;
}

const PLATFORM_FEE_PERCENT = 0.1; // 10%

const PRICING = {
  BUSINESS: { amount: 4900, name: 'GigGrow Business Subscription', profileType: 'CLIENT' },
  PREMIUM: { amount: 2900, name: 'GigGrow Premium Membership', profileType: 'PROVIDER' }
};

export const logPaymentStatusChange = async (
  paymentRecordId: string,
  fromStatus: PaymentStatus | null,
  toStatus: PaymentStatus,
  actor: string | null,
  source: string
) => {
  await prisma.paymentEvent.create({
    data: {
      paymentRecordId,
      fromStatus,
      toStatus,
      actor: actor || 'SYSTEM',
      source
    }
  });
};

async function ensureProductAndPrice(tier: 'BUSINESS' | 'PREMIUM') {
  const stripe = getStripe();
  const config = PRICING[tier];
  
  // Try to find existing product
  const products = await stripe.products.list({ limit: 100 });
  let product = products.data.find(p => p.name === config.name);
  
  if (!product) {
    product = await stripe.products.create({
      name: config.name,
      metadata: { tier }
    });
  }

  // Try to find existing price
  const prices = await stripe.prices.list({ product: product.id, active: true, limit: 1 });
  let price = prices.data[0];

  if (!price) {
    price = await stripe.prices.create({
      unit_amount: config.amount,
      currency: 'usd',
      recurring: { interval: 'month' },
      product: product.id,
    });
  }

  return price.id;
}

export const createSubscription = async (userId: string, tier: 'BUSINESS' | 'PREMIUM') => {
  const stripe = getStripe();
  let profile: any;
  let model: any;

  if (PRICING[tier].profileType === 'CLIENT') {
    profile = await prisma.clientProfile.findUnique({ where: { userId } });
    model = prisma.clientProfile;
  } else {
    profile = await prisma.providerProfile.findUnique({ where: { userId } });
    model = prisma.providerProfile;
  }

  if (!profile) throw new Error('Profile not found');

  // Seam 5: Lumos Upgrade Advisory
  const advisory = await advisePayment('profiles.upgrade', { userId, role: PRICING[tier].profileType }, {
    targetTier: tier,
    amount: PRICING[tier].amount / 100
  });

  // Ensure Stripe Customer
  let customerId = profile.stripeCustomerId;
  if (!customerId) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    const customer = await stripe.customers.create({
      email: user?.email,
      metadata: { userId, profileId: profile.id }
    });
    customerId = customer.id;
    await model.update({
      where: { userId },
      data: { stripeCustomerId: customerId }
    });
  }

  const priceId = await ensureProductAndPrice(tier);

  // Create Subscription
  const subscription = await stripe.subscriptions.create({
    customer: customerId,
    items: [{ price: priceId }],
    payment_behavior: 'default_incomplete',
    payment_settings: { save_default_payment_method: 'on_subscription' },
    expand: ['latest_invoice.payment_intent'],
    metadata: { userId, tier }
  });

  await model.update({
    where: { userId },
    data: { stripeSubscriptionId: subscription.id }
  });

  const latestInvoice = subscription.latest_invoice as any;
  const paymentIntent = latestInvoice?.payment_intent as any;

  return {
    subscriptionId: subscription.id,
    clientSecret: paymentIntent?.client_secret,
    lumosAdvisoryId: advisory.advisory_id
  };
};

export const createPaymentIntent = async (contractId: string, amount: number, userId: string, clientNonce?: string) => {
  const contract = await prisma.contract.findUnique({
    where: { id: contractId },
    include: { client: true, provider: true }
  });

  if (!contract || contract.client.userId !== userId) {
    throw new Error('Unauthorized or Contract not found');
  }

  const fee = amount * PLATFORM_FEE_PERCENT;

  const stripe = getStripe();
  // Use clientNonce if provided for idempotency, otherwise fallback to time-window key
  const idempotencyKey = clientNonce || `intent-${contractId}-${Math.floor(Date.now() / 10000)}`;

  const stripeIntent = await stripe.paymentIntents.create({
    amount: Math.round(amount * 100), // Stripe expects cents
    currency: 'usd',
    metadata: {
      contractId,
      userId
    }
  }, {
    idempotencyKey
  });

  // Seam 1: Lumos Intent Creation Advisory
  const advisory = await advisePayment('payments.create_intent', { userId, role: 'CLIENT' }, {
    contractId,
    amount,
    fee,
    currency: 'usd',
    stripeIntentId: stripeIntent.id
  });

  const record = await prisma.paymentRecord.create({
    data: {
      contractId,
      amount,
      fee,
      status: 'PENDING',
      stripeIntentId: stripeIntent.id,
      currency: 'usd',
      payerUserId: userId,
      payeeProviderId: contract.provider.id,
      lumosAdvisoryId: advisory.advisory_id,
      lumosRiskClass: advisory.risk_class
    }
  });

  // Initial audit event
  await logPaymentStatusChange(record.id, null, 'PENDING', userId, 'INTENT_CREATION');

  return {
    ...record,
    clientSecret: stripeIntent.client_secret
  };
};

export const confirmPayment = async (paymentRecordId: string, userId: string) => {
  const payment = await prisma.paymentRecord.findUnique({
    where: { id: paymentRecordId },
    include: { contract: { include: { client: true } } }
  });

  if (!payment || payment.contract.client.userId !== userId) {
    throw new Error('Unauthorized or Payment not found');
  }

  if (!payment.stripeIntentId) {
    throw new Error('No stripe intent associated with this record');
  }

  const stripe = getStripe();
  const stripeIntent = await stripe.paymentIntents.retrieve(payment.stripeIntentId);

  // Seam 2: Lumos Confirmation Advisory
  await advisePayment('payments.confirm', { userId, role: 'CLIENT' }, {
    paymentRecordId,
    observedStatus: stripeIntent.status,
    stripeIntentId: payment.stripeIntentId
  });

  if (stripeIntent.status === 'succeeded') {
    const updated = await prisma.paymentRecord.update({
      where: { id: paymentRecordId },
      data: { status: 'COMPLETED' }
    });
    await logPaymentStatusChange(paymentRecordId, payment.status, 'COMPLETED', userId, 'CONFIRM');
    return updated;
  } else {
    throw new Error(`Stripe payment intent status is ${stripeIntent.status}, not succeeded`);
  }
};

export const refundPayment = async (paymentRecordId: string, userId: string) => {
  const payment = await prisma.paymentRecord.findUnique({
    where: { id: paymentRecordId },
    include: { contract: true }
  });

  if (!payment) throw new Error('Payment record not found');
  if (payment.status !== 'COMPLETED') throw new Error('Only completed payments can be refunded');
  if (!payment.stripeIntentId) throw new Error('No stripe intent associated with this record');

  // Seam 4: Triple-Lock Advisory
  const advisory = await advisePayment('payments.refund', { userId, role: 'ADMIN' }, {
    paymentRecordId,
    amount: payment.amount,
    stripeIntentId: payment.stripeIntentId
  });

  if (advisory.risk_class === 'elevated') {
    logger.warn('Triple-lock escalation: Refund flagged as elevated risk by Lumos');
    // In a real env, this might wait for a manual Willie override or Debbie executive_agent.bill_gateway_check
  }

  const stripe = getStripe();
  const refund = await stripe.refunds.create({
    payment_intent: payment.stripeIntentId,
    amount: Math.round(payment.amount * 100)
  });

  const updated = await prisma.paymentRecord.update({
    where: { id: paymentRecordId },
    data: { 
      status: 'REFUNDED',
      lumosAdvisoryId: advisory.advisory_id,
      lumosRiskClass: advisory.risk_class
    }
  });

  await logPaymentStatusChange(paymentRecordId, payment.status, 'REFUNDED', userId, 'ADMIN');
  return updated;
};

export const processWebhook = async (event: any) => {
  logger.info('Processing payment webhook', event.type);
  
  // Seam 3: Lumos Webhook Advisory
  await advisePayment('payments.webhook', { role: 'SYSTEM' }, {
    eventType: event.type,
    stripeEventId: event.id,
    object: event.data.object
  });

  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object;
    const records = await prisma.paymentRecord.findMany({ where: { stripeIntentId: paymentIntent.id } });
    for (const record of records) {
      if (record.status !== 'COMPLETED') {
        await prisma.paymentRecord.update({
          where: { id: record.id },
          data: { status: 'COMPLETED' }
        });
        await logPaymentStatusChange(record.id, record.status, 'COMPLETED', null, 'STRIPE_WEBHOOK');
      }
    }
    logger.info(`Payment COMPLETED for intent ${paymentIntent.id}`);
  } else if (event.type === 'payment_intent.payment_failed') {
    const paymentIntent = event.data.object;
    const records = await prisma.paymentRecord.findMany({ where: { stripeIntentId: paymentIntent.id } });
    for (const record of records) {
      if (record.status !== 'FAILED') {
        await prisma.paymentRecord.update({
          where: { id: record.id },
          data: { status: 'FAILED' }
        });
        await logPaymentStatusChange(record.id, record.status, 'FAILED', null, 'STRIPE_WEBHOOK');
      }
    }
    logger.info(`Payment FAILED for intent ${paymentIntent.id}`);
  } else if (event.type === 'charge.refunded') {
    const charge = event.data.object;
    const records = await prisma.paymentRecord.findMany({ where: { stripeIntentId: charge.payment_intent } });
    for (const record of records) {
      if (record.status !== 'REFUNDED') {
        await prisma.paymentRecord.update({
          where: { id: record.id },
          data: { status: 'REFUNDED' }
        });
        await logPaymentStatusChange(record.id, record.status, 'REFUNDED', null, 'STRIPE_WEBHOOK');
      }
    }
  } else if (event.type === 'charge.dispute.created') {
    const dispute = event.data.object as Stripe.Dispute;
    const piId = dispute.payment_intent as string;
    
    // Seam 3 Extension: Dispute Mirror to Bill Nemotron Judge
    await advisePayment('payments.dispute_created', { role: 'SYSTEM' }, {
      disputeId: dispute.id,
      amount: dispute.amount / 100,
      reason: dispute.reason,
      status: dispute.status
    });

    const records = await prisma.paymentRecord.findMany({ 
      where: { stripeIntentId: piId },
      include: { contract: true }
    });

    for (const record of records) {
      await prisma.paymentRecord.update({
        where: { id: record.id },
        data: { status: 'DISPUTED' }
      });
      await prisma.contract.update({
        where: { id: record.contractId },
        data: { status: 'DISPUTED' }
      });
      await logPaymentStatusChange(record.id, record.status, 'DISPUTED', null, 'STRIPE_WEBHOOK');
    }
    logger.warn(`Dispute created for intent ${piId}`);
  } else if (event.type === 'charge.dispute.closed') {
    const dispute = event.data.object as Stripe.Dispute;
    // Seam 3 Extension: Dispute Mirror to Bill Nemotron Judge
    await advisePayment('payments.dispute_closed', { role: 'SYSTEM' }, {
      disputeId: dispute.id,
      status: dispute.status,
      evidence_details: dispute.evidence_details
    });
    logger.info(`Dispute closed: ${event.id}`);
  } else if (event.type === 'customer.subscription.updated' || event.type === 'customer.subscription.created') {
    const subscription = event.data.object as any;
    const { userId, tier } = subscription.metadata;
    const expiresAt = new Date(subscription.current_period_end * 1000);

    if (tier === 'BUSINESS') {
      await prisma.clientProfile.update({
        where: { userId },
        data: {
          subscriptionTier: 'BUSINESS',
          subscriptionExpiresAt: expiresAt,
          currentPeriodEnd: expiresAt,
          stripeSubscriptionId: (subscription as any).id
        }
      });
    } else if (tier === 'PREMIUM') {
      await prisma.providerProfile.update({
        where: { userId },
        data: {
          membershipTier: 'PREMIUM',
          membershipExpiresAt: expiresAt,
          currentPeriodEnd: expiresAt,
          isPremium: true,
          stripeSubscriptionId: (subscription as any).id
        }
      });
    }
    logger.info(`Subscription ${subscription.id} updated for user ${userId}`);
  } else if (event.type === 'customer.subscription.deleted') {
    const subscription = event.data.object as any;
    const { userId, tier } = subscription.metadata;

    if (tier === 'BUSINESS') {
      await prisma.clientProfile.update({
        where: { userId },
        data: { subscriptionTier: 'FREE', stripeSubscriptionId: null }
      });
    } else if (tier === 'PREMIUM') {
      await prisma.providerProfile.update({
        where: { userId },
        data: { membershipTier: 'BASIC', isPremium: false, stripeSubscriptionId: null }
      });
    }
    logger.info(`Subscription ${subscription.id} deleted for user ${userId}`);
  } else if (event.type === 'invoice.payment_succeeded') {
    const invoice = event.data.object as any;
    if (invoice.subscription) {
      const subscription = await getStripe().subscriptions.retrieve(invoice.subscription as string) as any;
      const { userId, tier } = subscription.metadata;
      const expiresAt = new Date(subscription.current_period_end * 1000);

      if (tier === 'BUSINESS') {
        await prisma.clientProfile.update({
          where: { userId },
          data: { subscriptionExpiresAt: expiresAt, currentPeriodEnd: expiresAt }
        });
      } else if (tier === 'PREMIUM') {
        await prisma.providerProfile.update({
          where: { userId },
          data: { membershipExpiresAt: expiresAt, currentPeriodEnd: expiresAt }
        });
      }
    }
  }
};

export const constructEvent = (payload: Buffer, sig: string) => {
  const stripe = getStripe();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    throw new Error('STRIPE_WEBHOOK_SECRET is not configured');
  }
  return stripe.webhooks.constructEvent(payload, sig, webhookSecret);
};

export const getContractPayments = async (contractId: string, userId: string, role: string) => {
  const contract = await prisma.contract.findUnique({
    where: { id: contractId },
    include: { client: true, provider: true }
  });

  if (!contract) throw new Error('Contract not found');

  if (role !== 'ADMIN' && contract.client.userId !== userId && contract.provider.userId !== userId) {
    throw new Error('Unauthorized');
  }

  return prisma.paymentRecord.findMany({
    where: { contractId },
    orderBy: { createdAt: 'desc' }
  });
};

export const getPaymentTelemetry = async () => {
  const allPayments = await prisma.paymentRecord.findMany();
  
  const grossRevenue = allPayments.reduce((acc, p) => acc + p.amount, 0);
  const netEarnings = allPayments.reduce((acc, p) => acc + (p.amount - p.fee), 0);
  const escrowed = allPayments.filter(p => p.status === 'PENDING').reduce((acc, p) => acc + p.amount, 0);

  // Group by day for the chart
  const sixDaysAgo = new Date();
  sixDaysAgo.setDate(sixDaysAgo.getDate() - 6);
  
  const dailyData = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const dateStr = d.toISOString().split('T')[0];
    
    const dayPayments = allPayments.filter(p => p.createdAt.toISOString().split('T')[0] === dateStr);
    dailyData.push({
      name: d.toLocaleDateString('en-US', { day: '2-digit', month: 'short' }).toUpperCase(),
      revenue: dayPayments.reduce((acc, p) => acc + p.amount, 0),
      costs: dayPayments.reduce((acc, p) => acc + p.fee, 0)
    });
  }

  const latestTransactions = allPayments.slice(-5).reverse().map(p => ({
    date: p.createdAt.toLocaleDateString('en-US', { day: '2-digit', month: 'short' }).toUpperCase(),
    desc: `Gig Settlement // TRACE-${p.id.substring(0, 8)}`,
    amount: `${p.amount > 0 ? '+' : ''}$${p.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
    status: p.status === 'COMPLETED' ? 'SETTLED' : 'ESCROWED'
  }));

  return {
    grossRevenue,
    netEarnings,
    escrowed,
    dailyData,
    latestTransactions
  };
};
