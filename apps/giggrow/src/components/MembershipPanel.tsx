import React, { useState } from 'react';
import { Shield, Zap, CheckCircle2, Loader2, Building2, HardHat, CreditCard, TrendingUp, AlertCircle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { apiFetch } from '../lib/api';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY || 'pk_test_TYooMQauvdEDq54NiTphI7jx');

const CheckoutForm: React.FC<{ tier: string; onCancel: () => void; onSuccess: () => void }> = ({ tier, onCancel, onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setProcessing(true);
    const { error: submitError } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/membership?success=true&tier=${tier}`,
      },
    });

    if (submitError) {
      setError(submitError.message || 'Payment failed');
      setProcessing(false);
    } else {
      onSuccess();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="rounded-lg bg-white/5 p-4 border border-white/10">
        <PaymentElement options={{ layout: 'tabs' }} />
      </div>
      {error && <div className="text-[10px] font-black uppercase text-red-500">{error}</div>}
      <div className="flex gap-4">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 rounded-sm border border-white/20 py-3 text-[10px] font-black uppercase tracking-widest text-white/60 hover:bg-white/5"
        >
          CANCEL
        </button>
        <button
          type="submit"
          disabled={!stripe || processing}
          className="flex-1 usa-button py-3 text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2"
        >
          {processing ? <Loader2 className="h-4 w-4 animate-spin" /> : `CONFIRM ${tier} UPGRADE`}
        </button>
      </div>
    </form>
  );
};

interface MembershipPanelProps {
  userRole: 'CLIENT' | 'PROVIDER';
  currentTier: string;
}

export const MembershipPanel: React.FC<MembershipPanelProps> = ({ userRole, currentTier }) => {
  const [isUpgrading, setIsUpgrading] = useState(false);
  const [checkoutTier, setCheckoutTier] = useState<string | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleUpgradeInitiate = async (tier: string) => {
    setIsUpgrading(true);
    setError(null);
    setSuccess(null);

    try {
      const data = await apiFetch<{ clientSecret: string }>('/api/payments/create-subscription', {
        method: 'POST',
        body: JSON.stringify({ tier })
      });

      setClientSecret(data.clientSecret);
      setCheckoutTier(tier);
    } catch (err: any) {
      console.error('Subscription initiation failed:', err);
      setError(err.message);
    } finally {
      setIsUpgrading(false);
    }
  };

  const tiers = userRole === 'CLIENT' ? [
    {
      name: 'FREE',
      price: '$0/mo',
      description: 'For small individual projects.',
      features: ['5 AI Estimations / mo', 'Standard Job Posting', 'Basic Verification'],
      color: 'white/40',
      isCurrent: currentTier === 'FREE'
    },
    {
      name: 'BUSINESS',
      price: '$49/mo',
      description: 'For growing businesses and regular hiring.',
      features: ['Unlimited AI Estimations', 'Priority Opportunity Routing', 'Advanced Forensic Reports', 'Monthly Usage Billing'],
      color: '#00f0ff',
      isCurrent: currentTier === 'BUSINESS'
    }
  ] : [
    {
      name: 'BASIC',
      price: '$0/mo',
      description: 'Standard provider profile.',
      features: ['3 AI Estimations total', 'Standard Bidding', 'Basic Verification'],
      color: 'white/40',
      isCurrent: currentTier === 'BASIC'
    },
    {
      name: 'PREMIUM',
      price: '$29/mo',
      description: 'For elite providers and service teams.',
      features: ['Unlimited AI Estimations', 'Premium Badge & Visibility', 'Real-time Signal Access', 'Forensic Bid Analysis'],
      color: '#ff00ff',
      isCurrent: currentTier === 'PREMIUM'
    }
  ];

  return (
    <div className="rounded-2xl border border-white/10 bg-[#0a0a1f]/60 p-6 backdrop-blur-xl md:p-8">
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-3 text-white">
          <Shield className="h-5 w-5 text-[#00f0ff]" />
          <h2 className="text-[12px] font-black uppercase tracking-[0.4em]">MEMBERSHIP HUB</h2>
        </div>
        <div className="rounded-full border border-[#00f0ff]/30 bg-[#00f0ff]/10 px-4 py-1">
          <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[#00f0ff]">
            CURRENT: {currentTier}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {tiers.map((tier, i) => (
          <div 
            key={i} 
            className={`relative rounded-xl border p-6 transition-all ${tier.isCurrent ? 'border-[#00f0ff] bg-[#00f0ff]/5' : 'border-white/10 bg-white/[0.02] hover:border-white/20'}`}
          >
            {tier.isCurrent && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[#00f0ff] px-3 py-0.5 text-[8px] font-black uppercase tracking-[0.1em] text-[#0a0a1f]">
                ACTIVE TIER
              </div>
            )}
            
            <div className="mb-4">
              <h3 className="text-xl font-black uppercase tracking-tight text-white">{tier.name}</h3>
              <div className="mt-1 text-2xl font-black" style={{ color: tier.color === 'white/40' ? 'white' : tier.color }}>{tier.price}</div>
              <p className="mt-2 text-xs text-white/40">{tier.description}</p>
            </div>

            <ul className="mb-8 space-y-3">
              {tier.features.map((feature, j) => (
                <li key={j} className="flex items-center gap-3 text-xs text-white/70">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-[#00f0ff]" />
                  {feature}
                </li>
              ))}
            </ul>

            {!tier.isCurrent && (
              <button
                onClick={() => handleUpgradeInitiate(tier.name)}
                disabled={isUpgrading}
                className="usa-button w-full py-3 text-[10px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-2"
              >
                {isUpgrading ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  <>
                    <Zap className="h-3 w-3" />
                    UPGRADE NOW
                  </>
                )}
              </button>
            )}
          </div>
        ))}
      </div>

      <AnimatePresence>
        {checkoutTier && clientSecret && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#0a0a1f]/90 p-6 backdrop-blur-xl"
          >
            <div className="w-full max-w-xl rounded-2xl border border-[#00f0ff]/30 bg-black p-8 shadow-[0_0_50px_rgba(0,240,255,0.1)]">
              <div className="mb-8 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-black uppercase tracking-tight text-white italic">
                    {checkoutTier} <span className="text-[#00f0ff]">ACTIVATION</span>
                  </h2>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 mt-1">SECURE ENCRYPTED PAYMENT CHANNEL</p>
                </div>
                <button onClick={() => setCheckoutTier(null)} className="text-white/40 hover:text-white">
                  <X className="h-6 w-6" />
                </button>
              </div>

              <Elements stripe={stripePromise} options={{ clientSecret, appearance: { theme: 'night' } }}>
                <CheckoutForm 
                  tier={checkoutTier} 
                  onCancel={() => setCheckoutTier(null)} 
                  onSuccess={() => {
                    setCheckoutTier(null);
                    setSuccess(`Upgrade to ${checkoutTier} initiated! It will activate shortly.`);
                  }} 
                />
              </Elements>

              <div className="mt-8 flex items-center gap-3 border-t border-white/10 pt-6">
                <CreditCard className="h-4 w-4 text-[#ff00ff]" />
                <p className="text-[9px] uppercase tracking-widest text-white/30">
                  Billing managed by MorrisSoft Sovereign Rails. PCI Compliant.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {error && (
        <div className="mt-6 flex items-center gap-3 rounded-sm border border-[#ff00ff]/30 bg-[#ff00ff]/5 p-4 text-[#ff00ff]">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span className="text-[10px] font-bold uppercase tracking-[0.1em]">{error}</span>
        </div>
      )}

      {success && (
        <div className="mt-6 flex items-center gap-3 rounded-sm border border-[#00f0ff]/30 bg-[#00f0ff]/5 p-4 text-[#00f0ff]">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span className="text-[10px] font-bold uppercase tracking-[0.1em]">{success}</span>
        </div>
      )}

      <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="flex items-center gap-3 rounded-lg border border-white/5 bg-white/[0.02] p-4">
          <Building2 className="h-5 w-5 text-[#00f0ff]" />
          <div className="flex flex-col">
            <span className="text-[12px] font-black text-white">BUSINESS</span>
            <span className="text-[8px] font-bold uppercase tracking-[0.1em] text-white/40">BILLING READY</span>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-lg border border-white/5 bg-white/[0.02] p-4">
          <CreditCard className="h-5 w-5 text-[#ff00ff]" />
          <div className="flex flex-col">
            <span className="text-[12px] font-black text-white">SECURE</span>
            <span className="text-[8px] font-bold uppercase tracking-[0.1em] text-white/40">PAYMENT RAILS</span>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-lg border border-white/5 bg-white/[0.02] p-4">
          <TrendingUp className="h-5 w-5 text-[#00f0ff]" />
          <div className="flex flex-col">
            <span className="text-[12px] font-black text-white">USAGE</span>
            <span className="text-[8px] font-bold uppercase tracking-[0.1em] text-white/40">REAL-TIME TRACKING</span>
          </div>
        </div>
      </div>
    </div>
  );
};
