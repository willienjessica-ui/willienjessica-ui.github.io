import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { apiFetch } from '../lib/api';
import { Loader2, ShieldCheck, AlertCircle, CheckCircle2 } from 'lucide-react';

// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY || 'pk_test_TYooMQauvdEDq54NiTphI7jx');

interface CheckoutFormProps {
  clientSecret: string;
  onSuccess: () => void;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({ clientSecret, onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements || isLoading) {
      return;
    }

    setIsLoading(true);

    const { error: submitError } = await elements.submit();
    if (submitError) {
      setMessage(submitError.message || 'An error occurred during submission.');
      setIsLoading(false);
      return;
    }

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // Make sure to change this to your payment completion page
        return_url: window.location.origin,
      },
      redirect: 'if_required',
    });

    if (error) {
      if (error.type === 'card_error' || error.type === 'validation_error') {
        setMessage(error.message || 'An error occurred.');
      } else {
        setMessage('An unexpected error occurred.');
      }
    } else {
      onSuccess();
    }

    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="rounded-xl bg-white p-4">
        <PaymentElement />
      </div>
      
      {message && (
        <div className="flex items-center gap-3 rounded-sm border border-[#ff00ff]/30 bg-[#ff00ff]/5 p-4 text-[#ff00ff]">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span className="text-[10px] font-bold uppercase tracking-[0.1em]">{message}</span>
        </div>
      )}

      <button
        disabled={isLoading || !stripe || !elements}
        className="w-full rounded-md border border-[#00f0ff]/50 bg-gradient-to-r from-[#00f0ff] to-[#00b0ff] px-8 py-4 text-[11px] font-black uppercase tracking-[0.35em] text-[#0a0a1f] shadow-[0_0_40px_rgba(0,240,255,0.4)] transition hover:scale-[1.02] hover:shadow-[0_0_55px_rgba(0,255,255,0.55)] disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            PROCESSING...
          </>
        ) : (
          <>
            <ShieldCheck className="h-4 w-4" />
            PAY NOW
          </>
        )}
      </button>
    </form>
  );
};

interface PaymentCheckoutProps {
  contractId: string;
  amount: number;
  onPaymentComplete: () => void;
}

export const PaymentCheckout: React.FC<PaymentCheckoutProps> = ({ contractId, amount, onPaymentComplete }) => {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    const initPayment = async () => {
      try {
        const clientNonce = crypto.randomUUID();
        const data = await apiFetch('/api/payments/create-intent', {
          method: 'POST',
          body: JSON.stringify({ contractId, amount, clientNonce }),
        });
        setClientSecret(data.clientSecret);
      } catch (err: any) {
        setError(err.message || 'Failed to initialize payment');
      } finally {
        setIsInitializing(false);
      }
    };

    initPayment();
  }, [contractId, amount]);

  const handleSuccess = () => {
    setIsSuccess(true);
    onPaymentComplete();
  };

  if (isInitializing) {
    return (
      <div className="flex h-48 items-center justify-center rounded-2xl border border-white/10 bg-[#0a0a1f]/60">
        <Loader2 className="h-8 w-8 animate-spin text-[#00f0ff]" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center gap-3 rounded-2xl border border-[#ff00ff]/30 bg-[#ff00ff]/5 p-6 text-[#ff00ff]">
        <AlertCircle className="h-6 w-6 shrink-0" />
        <span className="text-sm font-bold uppercase tracking-[0.1em]">{error}</span>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-[#00f0ff]/30 bg-[#00f0ff]/5 p-8 text-center backdrop-blur-xl md:p-12">
        <CheckCircle2 className="mb-6 h-16 w-16 text-[#00f0ff]" />
        <h2 className="mb-2 text-2xl font-black uppercase tracking-tight text-white">Payment Successful</h2>
        <p className="mb-8 max-w-sm text-sm text-white/60">
          Your transaction has been securely processed. The funds are now secured in the contract vault.
        </p>
        <button
          onClick={() => setIsSuccess(false)}
          className="rounded-md border border-[#00f0ff]/50 bg-gradient-to-r from-[#00f0ff] to-[#00b0ff] px-8 py-4 text-[11px] font-black uppercase tracking-[0.35em] text-[#0a0a1f] shadow-[0_0_40px_rgba(0,240,255,0.4)] transition hover:scale-[1.02] hover:shadow-[0_0_55px_rgba(0,255,255,0.55)]"
        >
          VIEW CONTRACT DETAILS
        </button>
      </div>
    );
  }

  if (!clientSecret) return null;

  return (
    <div className="rounded-2xl border border-white/10 bg-[#0a0a1f]/60 p-6 backdrop-blur-xl md:p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black uppercase tracking-tight text-white">SECURE CHECKOUT</h2>
          <p className="text-sm text-white/60">Complete your payment for this contract.</p>
        </div>
        <div className="text-right">
          <div className="text-3xl font-black text-[#00f0ff]">${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
          <div className="text-[10px] uppercase tracking-[0.2em] text-white/40">TOTAL AMOUNT</div>
        </div>
      </div>

      <Elements stripe={stripePromise} options={{ clientSecret, appearance: { theme: 'night' } }}>
        <CheckoutForm clientSecret={clientSecret} onSuccess={handleSuccess} />
      </Elements>
    </div>
  );
};
