import React, { useState } from 'react';
import { Shield, BarChart3, FileText, ShieldAlert, UserCheck } from 'lucide-react';

function HealthItem({ label, status, value }: { label: string; status: string; value: number }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="h-1.5 w-1.5 rounded-full bg-[#00D1FF]" />
        <span className="text-[11px] font-bold uppercase tracking-widest text-white/70">
          {label}
        </span>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-[10px] font-black text-[#00D1FF] uppercase tracking-widest">
          {status}
        </span>
        <span className="text-sm font-bold text-white">{value}%</span>
      </div>
    </div>
  );
}

export const GovBidView = () => {
  const [selectedMode, setSelectedMode] = useState<'scan' | 'analyze' | 'negotiate'>('scan');

  const opportunities = [
    {
      agency: 'U.S. Army Corps of Engineers',
      title: 'Regional Site Work & Surface Repair',
      value: '$480,000',
      deadline: '14 DAYS',
      fit: '92%',
      location: 'Dallas, TX',
    },
    {
      agency: 'Arkansas DOT',
      title: 'Roadway Striping / Surface Logistics',
      value: '$185,000',
      deadline: '8 DAYS',
      fit: '87%',
      location: 'Little Rock, AR',
    },
    {
      agency: 'GSA Facilities',
      title: 'Federal Building Maintenance Support',
      value: '$620,000',
      deadline: '21 DAYS',
      fit: '90%',
      location: 'Oklahoma City, OK',
    },
  ];

  const riskFlags = [
    'Prevailing wage exposure detected',
    'Insurance / bonding burden above normal threshold',
    'Liquidated damages language needs counter-position',
    'Subcontractor margin compression risk',
    'Scope ambiguity favors change-order leverage',
  ];

  const negotiationOutputs = [
    'Clarification request draft',
    'Exception & assumptions packet',
    'Scope protection language',
    'Subcontractor defense language',
    'Pricing defense summary',
  ];

  const handleBuildPacket = () => {
    const content = `GOVBID NEGOTIATION PACKET\n\n` +
      `RISK FLAGS:\n` +
      riskFlags.map(flag => `- ${flag}`).join('\n') +
      `\n\nNEGOTIATION OUTPUTS:\n` +
      negotiationOutputs.map(output => `- ${output}`).join('\n');

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'negotiation-packet.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="animate-[fadeIn_.4s_ease] space-y-10 relative z-30 mx-auto max-w-7xl px-6 pt-10 md:px-10">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-7 space-y-8">
          <div className="inline-flex items-center gap-3 border border-[#00D1FF]/30 bg-[#00D1FF]/5 px-6 py-3 rounded-full">
            <Shield className="w-4 h-4 text-[#00D1FF]" />
            <span className="text-[11px] font-black uppercase tracking-[0.5em] text-[#00D1FF]">
              GOVERNMENT CONTRACT NEGOTIATION ENGINE
            </span>
          </div>

          <div className="space-y-5">
            <h2 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.84] uppercase italic">
              WIN. <br />
              <span className="text-[#00D1FF] drop-shadow-[0_0_15px_rgba(0,209,255,0.45)]">
                DEFEND.
              </span>{' '}
              <br />
              <span className="text-white">NEGOTIATE.</span>
            </h2>

            <p className="text-xl text-gray-400 font-light max-w-3xl leading-relaxed">
              Public contract intelligence for serious operators. Scan bid opportunities,
              break down RFP language, defend pricing, flag risk, and generate premium
              negotiation packets before your competition even understands the scope.
            </p>
          </div>

          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => setSelectedMode('scan')}
              className={`px-8 py-4 text-[11px] font-black uppercase tracking-[0.35em] border transition-all ${
                selectedMode === 'scan'
                  ? 'bg-[#00D1FF] text-black border-[#00D1FF]'
                  : 'bg-transparent text-[#00D1FF] border-[#00D1FF]/30 hover:bg-[#00D1FF]/10'
              }`}
            >
              SCAN OPPORTUNITIES
            </button>

            <button
              onClick={() => setSelectedMode('analyze')}
              className={`px-8 py-4 text-[11px] font-black uppercase tracking-[0.35em] border transition-all ${
                selectedMode === 'analyze'
                  ? 'bg-[#00D1FF] text-black border-[#00D1FF]'
                  : 'bg-transparent text-[#00D1FF] border-[#00D1FF]/30 hover:bg-[#00D1FF]/10'
              }`}
            >
              ANALYZE RFP
            </button>

            <button
              onClick={() => setSelectedMode('negotiate')}
              className={`px-8 py-4 text-[11px] font-black uppercase tracking-[0.35em] border transition-all ${
                selectedMode === 'negotiate'
                  ? 'bg-[#00D1FF] text-black border-[#00D1FF]'
                  : 'bg-transparent text-[#00D1FF] border-[#00D1FF]/30 hover:bg-[#00D1FF]/10'
              }`}
            >
              BUILD NEGOTIATION PACKET
            </button>
          </div>
        </div>

        <div className="lg:col-span-5">
          <div className="bg-[#030712]/95 border border-[#00D1FF]/30 rounded-xl p-8 shadow-[0_0_60px_rgba(0,209,255,0.12)] backdrop-blur-3xl">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <BarChart3 className="w-6 h-6 text-[#00D1FF]" />
                <h3 className="text-[12px] font-black uppercase tracking-[0.45em] text-white">
                  GOVBID STATUS
                </h3>
              </div>
              <div className="h-2.5 w-2.5 rounded-full bg-[#00D1FF] shadow-[0_0_10px_rgba(0,209,255,1)] animate-pulse" />
            </div>

            <div className="space-y-6">
              <HealthItem label="Opportunity Scanner" status="ARMED" value={96} />
              <HealthItem label="RFP Parser" status="ONLINE" value={93} />
              <HealthItem label="Negotiation Engine" status="ACTIVE" value={91} />
              <HealthItem label="Risk Flag Layer" status="SYNCED" value={95} />
            </div>

            <div className="grid grid-cols-2 gap-5 pt-8 mt-8 border-t border-white/5">
              <div>
                <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
                  Premium Tier
                </div>
                <div className="text-2xl font-black text-white mt-2">GOVSHIELD</div>
              </div>
              <div>
                <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
                  Contract Class
                </div>
                <div className="text-2xl font-black text-[#00D1FF] mt-2">PUBLIC</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 pb-24">
        <div className="xl:col-span-5 bg-[#0a0f1d]/90 border border-[#00D1FF]/20 rounded-xl p-8 shadow-[0_0_40px_rgba(0,209,255,0.08)] backdrop-blur-3xl">
          <h3 className="text-lg font-black uppercase tracking-[0.35em] text-white mb-6 italic">
            Open Opportunities
          </h3>

          <div className="space-y-5">
            {opportunities.map((op) => (
              <div
                key={`${op.agency}-${op.title}`}
                className="border border-white/10 rounded-xl p-6 bg-white/[0.03] hover:border-[#00D1FF]/50 transition-all"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-black text-[#00D1FF] uppercase tracking-[0.35em]">
                    {op.agency}
                  </span>
                  <span className="text-[10px] font-black text-white bg-blue-600/20 border border-blue-500/30 px-3 py-1 rounded-full uppercase tracking-widest">
                    FIT {op.fit}
                  </span>
                </div>

                <h4 className="text-xl font-black uppercase tracking-tight text-white mb-3">
                  {op.title}
                </h4>

                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
                      Value
                    </div>
                    <div className="text-white font-bold mt-1">{op.value}</div>
                  </div>
                  <div>
                    <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
                      Deadline
                    </div>
                    <div className="text-white font-bold mt-1">{op.deadline}</div>
                  </div>
                  <div>
                    <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
                      Location
                    </div>
                    <div className="text-white font-bold mt-1">{op.location}</div>
                  </div>
                </div>

                <button className="w-full mt-5 py-4 bg-transparent border border-[#00D1FF]/30 text-[#00D1FF] text-[10px] font-black uppercase tracking-widest hover:bg-[#00D1FF]/10 transition-all">
                  VIEW SCOPE
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="xl:col-span-4 bg-[#0a0f1d]/90 border border-[#00D1FF]/20 rounded-xl p-8 shadow-[0_0_40px_rgba(0,209,255,0.08)] backdrop-blur-3xl">
          <h3 className="text-lg font-black uppercase tracking-[0.35em] text-white mb-6 italic">
            RFP Analyzer
          </h3>

          <div className="border-2 border-dashed border-[#00D1FF]/20 rounded-xl p-10 flex flex-col items-center justify-center text-center bg-white/[0.02]">
            <FileText className="text-[#00D1FF] w-10 h-10 mb-4" />
            <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">
              Upload Solicitation PDF
            </span>
            <p className="text-sm text-gray-400 max-w-xs leading-relaxed">
              Extract deadlines, labor requirements, insurance burdens, wage clauses,
              and negotiation leverage points.
            </p>
          </div>

          <div className="space-y-4 mt-8">
            <button className="w-full py-5 bg-blue-600 text-white text-[11px] font-black uppercase tracking-widest hover:bg-[#00D1FF] hover:text-black transition-all">
              PARSE RFP
            </button>
            <button className="w-full py-5 bg-transparent border border-[#00D1FF]/30 text-[#00D1FF] text-[11px] font-black uppercase tracking-widest hover:bg-[#00D1FF]/10 transition-all">
              EXTRACT CLAUSES
            </button>
          </div>
        </div>

        <div className="xl:col-span-3 space-y-8">
          <div className="bg-[#0a0f1d]/90 border border-[#00D1FF]/20 rounded-xl p-8 shadow-[0_0_40px_rgba(0,209,255,0.08)] backdrop-blur-3xl">
            <h3 className="text-lg font-black uppercase tracking-[0.35em] text-white mb-6 italic">
              Risk Flags
            </h3>

            <div className="space-y-4">
              {riskFlags.map((item) => (
                <div
                  key={item}
                  className="flex items-start gap-3 bg-white/[0.02] border border-white/10 rounded-lg p-4"
                >
                  <ShieldAlert className="w-4 h-4 text-[#00D1FF] mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-300 leading-relaxed">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#0a0f1d]/90 border border-[#00D1FF]/20 rounded-xl p-8 shadow-[0_0_40px_rgba(0,209,255,0.08)] backdrop-blur-3xl">
            <h3 className="text-lg font-black uppercase tracking-[0.35em] text-white mb-6 italic">
              Negotiation Outputs
            </h3>

            <div className="space-y-3">
              {negotiationOutputs.map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-3 border border-white/10 rounded-lg p-4 bg-white/[0.02]"
                >
                  <UserCheck className="w-4 h-4 text-[#00D1FF]" />
                  <span className="text-sm text-gray-300">{item}</span>
                </div>
              ))}
            </div>

            <button 
              onClick={handleBuildPacket}
              className="w-full mt-6 py-5 bg-[#00D1FF] text-black text-[11px] font-black uppercase tracking-widest hover:bg-white transition-all"
            >
              BUILD NEGOTIATION PACKET
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
