import React, { useState, useEffect } from 'react';
import { CreditCard, DollarSign, CheckCircle2, XCircle, Clock, Loader2, AlertCircle } from 'lucide-react';
import { apiFetch } from '../lib/api';

interface PaymentRecord {
  id: string;
  contractId: string;
  amount: number;
  fee: number;
  status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';
  stripeIntentId: string | null;
  createdAt: string;
  updatedAt: string;
}

interface PaymentHistoryProps {
  contractId: string;
  userRole: 'CLIENT' | 'PROVIDER';
}

export const PaymentHistory: React.FC<PaymentHistoryProps> = ({ contractId, userRole }) => {
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPayments();
  }, [contractId]);

  const fetchPayments = async () => {
    try {
      const data = await apiFetch(`/api/payments/contract/${contractId}`);
      setPayments(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch payment history');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
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

  return (
    <div className="rounded-2xl border border-white/10 bg-[#0a0a1f]/60 p-6 backdrop-blur-xl md:p-8">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3 text-[#00f0ff]">
          <CreditCard className="h-5 w-5" />
          <h2 className="text-[12px] font-black uppercase tracking-[0.4em]">PAYMENT HISTORY</h2>
        </div>
        <div className="rounded-full border border-[#00f0ff]/30 bg-[#00f0ff]/10 px-4 py-1">
          <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[#00f0ff]">
            {payments.length} TRANSACTIONS
          </span>
        </div>
      </div>

      {payments.length === 0 ? (
        <div className="flex h-32 flex-col items-center justify-center text-white/40">
          <CreditCard className="mb-2 h-8 w-8 opacity-20" />
          <p className="text-xs uppercase tracking-widest">No payment records found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {payments.map((payment) => (
            <div key={payment.id} className="flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-xl border border-white/10 bg-black/40 p-5 transition hover:border-white/20">
              <div className="flex items-start gap-4">
                <div className={`flex h-10 w-10 items-center justify-center rounded-full border ${
                  payment.status === 'COMPLETED' ? 'border-[#00f0ff]/30 bg-[#00f0ff]/10 text-[#00f0ff]' :
                  payment.status === 'FAILED' ? 'border-[#ff00ff]/30 bg-[#ff00ff]/10 text-[#ff00ff]' :
                  'border-yellow-500/30 bg-yellow-500/10 text-yellow-500'
                }`}>
                  {payment.status === 'COMPLETED' ? <CheckCircle2 className="h-5 w-5" /> :
                   payment.status === 'FAILED' ? <XCircle className="h-5 w-5" /> :
                   <Clock className="h-5 w-5" />}
                </div>
                <div>
                  <h3 className="text-sm font-black uppercase tracking-tight text-white">
                    {payment.status === 'COMPLETED' ? 'Payment Successful' :
                     payment.status === 'FAILED' ? 'Payment Failed' :
                     'Payment Pending'}
                  </h3>
                  <div className="mt-1 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">
                    {new Date(payment.createdAt).toLocaleDateString()} at {new Date(payment.createdAt).toLocaleTimeString()}
                  </div>
                  <div className="mt-1 text-[9px] uppercase tracking-[0.1em] text-white/30">
                    ID: {payment.id.split('-')[0]}
                  </div>
                </div>
              </div>
              
              <div className="text-left md:text-right">
                <div className="flex items-center gap-1 text-lg font-black text-white md:justify-end">
                  <DollarSign className="h-4 w-4 text-[#00f0ff]" />
                  {payment.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                {userRole === 'PROVIDER' && (
                  <div className="mt-1 text-[9px] font-bold uppercase tracking-[0.2em] text-white/40">
                    FEE: ${(payment.fee).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                )}
                <div className={`mt-1 inline-block rounded-full px-2 py-0.5 text-[8px] font-black uppercase tracking-[0.2em] ${
                  payment.status === 'COMPLETED' ? 'bg-[#00f0ff]/20 text-[#00f0ff]' :
                  payment.status === 'FAILED' ? 'bg-[#ff00ff]/20 text-[#ff00ff]' :
                  'bg-yellow-500/20 text-yellow-500'
                }`}>
                  {payment.status}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
