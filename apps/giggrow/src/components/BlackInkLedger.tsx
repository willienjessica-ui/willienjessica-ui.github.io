import React, { useEffect, useState } from 'react';
import { DollarSign, TrendingUp, ArrowUpRight, ArrowDownRight, Wallet, ShieldCheck, Activity } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { apiFetch } from '../lib/api.ts';

interface TelemetryData {
  grossRevenue: number;
  netEarnings: number;
  escrowed: number;
  dailyData: { name: string; revenue: number; costs: number }[];
  latestTransactions: { date: string; desc: string; amount: string; status: 'SETTLED' | 'ESCROWED' }[];
}

export const BlackInkLedger: React.FC = () => {
  const [telemetry, setTelemetry] = useState<TelemetryData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTelemetry = async () => {
      try {
        const data = await apiFetch<TelemetryData>('/api/payments/telemetry');
        setTelemetry(data);
      } catch (error) {
        console.error('Failed to fetch telemetry:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTelemetry();
    const interval = setInterval(fetchTelemetry, 30000); // 30s refresh
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center rounded-2xl border border-white/10 bg-[#0a0a1f]/60 backdrop-blur-xl">
        <Activity className="h-8 w-8 animate-pulse text-[#00f0ff]" />
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-[#0a0a1f]/60 p-6 backdrop-blur-xl md:p-8">
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <DollarSign className="h-6 w-6 text-[#00f0ff]" />
          <div>
            <h2 className="text-[14px] font-black uppercase tracking-[0.4em] text-white">THE BLACK INK LEDGER</h2>
            <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-white/40">Marketplace Real-time Revenue & Settlement</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-full border border-green-500/30 bg-green-500/10 px-3 py-1 text-[10px] font-black text-green-500">
            <ShieldCheck className="h-3 w-3" />
            ON-CHAIN SETTLED
          </div>
          <div className="flex items-center gap-2 rounded-full border border-[#00f0ff]/30 bg-[#00f0ff]/10 px-3 py-1 text-[10px] font-black text-[#00f0ff]">
            <Activity className="h-3 w-3" />
            LIVE FLOW
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3 mb-8">
        <StatsCard 
          label="GROSS MARKETPLACE REVENUE" 
          value={`$${telemetry?.grossRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}`} 
          change="+12.4%" 
          trend="up" 
          color="#00f0ff"
        />
        <StatsCard 
          label="NET PROVIDER EARNINGS" 
          value={`$${telemetry?.netEarnings.toLocaleString(undefined, { minimumFractionDigits: 2 })}`} 
          change="+8.1%" 
          trend="up" 
          color="#ff00ff"
        />
        <StatsCard 
          label="ESCROWED SETTLEMENTS" 
          value={`$${telemetry?.escrowed.toLocaleString(undefined, { minimumFractionDigits: 2 })}`} 
          change="-2.5%" 
          trend="down" 
          color="#ffffff"
        />
      </div>

      <div className="h-72 w-full rounded-xl border border-white/10 bg-black/40 p-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={telemetry?.dailyData || []}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
            <XAxis 
              dataKey="name" 
              stroke="#ffffff40" 
              fontSize={10} 
              tickFormatter={(val) => val.split(' ')[0]} 
            />
            <YAxis stroke="#ffffff40" fontSize={10} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#0a0a1f', border: '1px solid #ffffff20', borderRadius: '8px' }}
              itemStyle={{ fontSize: '12px' }}
            />
            <Line 
              type="monotone" 
              dataKey="revenue" 
              stroke="#00f0ff" 
              strokeWidth={3} 
              dot={{ r: 4, fill: '#00f0ff' }} 
              activeDot={{ r: 6, stroke: '#ffffff', strokeWidth: 2 }}
            />
            <Line 
              type="monotone" 
              dataKey="costs" 
              stroke="#ff00ff" 
              strokeWidth={2} 
              strokeDasharray="5 5" 
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-2">
        {telemetry?.latestTransactions.map((tx, i) => (
          <TransactionRow 
            key={i}
            date={tx.date} 
            desc={tx.desc} 
            amount={tx.amount} 
            status={tx.status as any} 
          />
        ))}
      </div>
    </div>
  );
};

const StatsCard: React.FC<{ label: string; value: string; change: string; trend: 'up' | 'down'; color: string }> = ({ label, value, change, trend, color }) => (
  <div className="rounded-xl border border-white/10 bg-white/5 p-6 hover:border-white/20 transition-all">
    <div className="text-[9px] font-black uppercase tracking-[0.2em] text-white/40 mb-2">{label}</div>
    <div className="text-2xl font-black mb-2" style={{ color }}>{value}</div>
    <div className="flex items-center gap-2">
      {trend === 'up' ? <TrendingUp className="h-4 w-4 text-green-500" /> : <TrendingUp className="h-4 w-4 text-red-500 rotate-180" />}
      <span className={`text-[10px] font-black ${trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>{change}</span>
      <span className="text-[9px] font-bold text-white/20 uppercase tracking-widest">VS LAST PERIOD</span>
    </div>
  </div>
);

const TransactionRow: React.FC<{ date: string; desc: string; amount: string; status: 'SETTLED' | 'ESCROWED' }> = ({ date, desc, amount, status }) => (
  <div className="flex items-center justify-between rounded-lg bg-white/[0.02] p-4 border border-transparent hover:border-white/10 transition-all">
    <div className="flex items-center gap-4">
      <div className="text-[10px] font-black text-white/30 w-12">{date}</div>
      <div className="flex flex-col">
        <div className="text-xs font-bold text-white tracking-tight">{desc}</div>
        <div className="text-[8px] font-black uppercase tracking-widest text-[#00f0ff] mt-1">{status}</div>
      </div>
    </div>
    <div className="text-sm font-black text-white">{amount}</div>
  </div>
);
