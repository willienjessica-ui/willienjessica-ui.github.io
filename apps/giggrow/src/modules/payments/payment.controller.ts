import { Request, Response } from 'express';
import { AuthRequest } from '../../middleware/auth.ts';
import * as paymentService from './payment.service.ts';
import { logger } from '../../lib/logger.ts';
import { advisePayment } from '../../lib/lumos.ts';

export const createSubscription = async (req: AuthRequest, res: Response) => {
  try {
    const { tier } = req.body;
    if (!['BUSINESS', 'PREMIUM'].includes(tier)) {
      return res.status(400).json({ error: 'Invalid tier' });
    }
    const result = await paymentService.createSubscription(req.user!.userId, tier);
    res.json(result);
  } catch (error: any) {
    res.status(400).json({ error: 'Subscription creation failed', message: error.message });
  }
};

export const createPaymentIntent = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
    const { contractId, amount, clientNonce } = req.body;
    const intent = await paymentService.createPaymentIntent(contractId, amount, req.user.userId, clientNonce);
    res.status(201).json(intent);
  } catch (error: any) {
    res.status(400).json({ error: 'Payment intent failed', message: error.message });
  }
};

export const confirmPayment = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
    const { paymentRecordId } = req.body;
    const result = await paymentService.confirmPayment(paymentRecordId, req.user.userId);
    res.json(result);
  } catch (error: any) {
    res.status(400).json({ error: 'Payment confirmation failed', message: error.message });
  }
};

export const refundPayment = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user || req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Forbidden: Admin access required' });
    }
    const { paymentRecordId } = req.body;
    const result = await paymentService.refundPayment(paymentRecordId, req.user.userId);
    res.json(result);
  } catch (error: any) {
    res.status(400).json({ error: 'Refund failed', message: error.message });
  }
};

export const handleWebhook = async (req: Request, res: Response) => {
  try {
    const sig = req.headers['stripe-signature'];
    if (!sig) {
      throw new Error('No stripe-signature header');
    }

    const event = paymentService.constructEvent((req as any).rawBody, sig as string);
    await paymentService.processWebhook(event);
    res.json({ received: true });
  } catch (error: any) {
    logger.error('Webhook error:', error);
    res.status(400).send(`Webhook Error: ${error.message}`);
  }
};

export const getContractPayments = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
    const payments = await paymentService.getContractPayments(req.params.contractId, req.user.userId, req.user.role);
    res.json(payments);
  } catch (error: any) {
    res.status(404).json({ error: 'Not Found', message: error.message });
  }
};

export const getTelemetry = async (req: AuthRequest, res: Response) => {
  try {
    const data = await paymentService.getPaymentTelemetry();
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: 'Telemetry failed', message: error.message });
  }
};

export const handleHoneypot = async (req: Request, res: Response) => {
  try {
    const trace_id = req.headers['x-trace-id'] || 'no-trace';
    logger.warn(`Honeypot triggered from ${req.ip} - Trace: ${trace_id}`);
    
    // Seam 6: Lumos Honeypot Advisory (Contamination Watch)
    await advisePayment('payments.honeypot', { role: 'ANONYMOUS' }, {
      ip: req.ip,
      headers: req.headers,
      body: req.body,
      url: req.url
    });

    // Return plausible success
    res.json({
      status: 'success',
      received: true,
      processing_id: `proc_${Math.random().toString(36).substring(7)}`
    });
  } catch (error) {
    res.json({ status: 'success', received: true });
  }
};
