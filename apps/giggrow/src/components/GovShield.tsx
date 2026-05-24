import React from 'react';
import { Shield, Upload, CheckCircle, AlertTriangle, Crosshair, Zap, Briefcase, FileSearch, Scale, UserCheck, HardHat, ShieldAlert, FileSignature } from 'lucide-react';

export const GovShield: React.FC = () => {
  return (
    <div className="relative z-30 mx-auto max-w-7xl px-6 pb-24 pt-10 md:px-10 md:pt-14">
      {/* HERO */}
      <div className="mb-16 text-center">
        <div className="mb-6 flex justify-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#00f0ff]/30 bg-[#0b1120]/70 px-4 py-2 backdrop-blur-md">
            <Shield className="h-4 w-4 text-[#00f0ff]" />
            <span className="text-[10px] font-black uppercase tracking-[0.35em] text-[#00f0ff]">
              GOVSHIELD™ NEGOTIATION ENGINE
            </span>
          </div>
        </div>
        <h1 className="mb-4 text-5xl font-black uppercase tracking-tighter text-white md:text-7xl lg:text-8xl">
          WIN. DEFEND. <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00f0ff] to-[#00b0ff]">NEGOTIATE.</span>
        </h1>
        <p className="mx-auto mb-10 max-w-2xl text-lg font-bold uppercase tracking-widest text-white/50">
          Public Contract Intelligence for Serious Operators.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <button className="rounded-md border border-[#00f0ff]/50 bg-gradient-to-r from-[#00f0ff] to-[#00b0ff] px-6 py-3 text-[12px] font-black uppercase tracking-[0.2em] text-[#0a0a1f] shadow-[0_0_35px_rgba(0,240,255,0.35)] transition hover:scale-[1.02] hover:shadow-[0_0_45px_rgba(0,255,255,0.55)]">
            SCAN OPPORTUNITIES
          </button>
          <button className="rounded-md border border-[#00f0ff]/30 bg-[#0b1120]/80 px-6 py-3 text-[12px] font-black uppercase tracking-[0.2em] text-[#00f0ff] backdrop-blur-md transition hover:bg-[#00f0ff]/10">
            ANALYZE RFP
          </button>
          <button className="rounded-md border border-[#00f0ff]/30 bg-[#0b1120]/80 px-6 py-3 text-[12px] font-black uppercase tracking-[0.2em] text-[#00f0ff] backdrop-blur-md transition hover:bg-[#00f0ff]/10">
            BUILD NEGOTIATION PACKET
          </button>
        </div>
      </div>

      {/* DASHBOARD LAYOUT */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* LEFT COLUMN */}
        <div className="space-y-8 lg:col-span-2">
          
          {/* 1. OPEN OPPORTUNITIES */}
          <div className="rounded-xl border border-[#00f0ff]/20 bg-[#070b14]/80 p-6 backdrop-blur-xl">
            <div className="mb-6 flex items-center gap-3 border-b border-[#00f0ff]/20 pb-4">
              <Crosshair className="h-5 w-5 text-[#00f0ff]" />
              <h2 className="text-[14px] font-black uppercase tracking-[0.3em] text-[#00f0ff]">OPEN OPPORTUNITIES</h2>
            </div>
            <div className="space-y-4">
              {[
                { agency: "Dept. of Defense - Logistics", deadline: "48 HOURS", value: "$4.2M", fit: "94%", loc: "Fort Bragg, NC" },
                { agency: "Federal Highway Admin", deadline: "5 DAYS", value: "$1.8M", fit: "88%", loc: "Infrastructure Region 4" }
              ].map((opp, i) => (
                <div key={i} className="flex flex-col md:flex-row items-start md:items-center justify-between rounded-lg border border-white/5 bg-white/5 p-4 transition hover:border-[#00f0ff]/30 hover:bg-white/10">
                  <div className="space-y-2">
                    <h3 className="text-lg font-bold text-white">{opp.agency}</h3>
                    <div className="flex flex-wrap gap-3 text-[10px] font-bold uppercase tracking-wider text-white/60">
                      <span className="flex items-center gap-1"><Zap className="h-3 w-3 text-yellow-400" /> DEADLINE: {opp.deadline}</span>
                      <span className="flex items-center gap-1"><Briefcase className="h-3 w-3 text-green-400" /> EST: {opp.value}</span>
                      <span className="flex items-center gap-1"><Crosshair className="h-3 w-3 text-[#00f0ff]" /> FIT: {opp.fit}</span>
                    </div>
                  </div>
                  <button className="mt-4 md:mt-0 rounded border border-[#00f0ff]/30 px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-[#00f0ff] transition hover:bg-[#00f0ff]/10">
                    View Scope
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* 2. RFP ANALYZER */}
          <div className="rounded-xl border border-[#00f0ff]/20 bg-[#070b14]/80 p-6 backdrop-blur-xl">
            <div className="mb-6 flex items-center gap-3 border-b border-[#00f0ff]/20 pb-4">
              <FileSearch className="h-5 w-5 text-[#00f0ff]" />
              <h2 className="text-[14px] font-black uppercase tracking-[0.3em] text-[#00f0ff]">RFP ANALYZER</h2>
            </div>
            <div className="mb-6 flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-[#00f0ff]/30 bg-[#00f0ff]/5 py-10 transition hover:bg-[#00f0ff]/10 cursor-pointer">
              <Upload className="mb-3 h-8 w-8 text-[#00f0ff]" />
              <p className="text-[12px] font-bold uppercase tracking-widest text-white/70">DRAG & DROP SOLICITATION PDF</p>
              <p className="mt-1 text-[10px] text-white/40">SECURE PARSING ENGINE</p>
            </div>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
              {['SCOPE REQS', 'DEADLINES', 'LABOR REQS', 'COMPLIANCE', 'RISK CLAUSES'].map((item, i) => (
                <div key={i} className="flex flex-col items-center justify-center rounded border border-white/10 bg-white/5 p-3 text-center">
                  <CheckCircle className="mb-2 h-4 w-4 text-[#00f0ff]/50" />
                  <span className="text-[9px] font-bold uppercase tracking-widest text-white/60">EXTRACT<br/>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 3. NEGOTIATION ENGINE */}
          <div className="rounded-xl border border-[#00f0ff]/20 bg-[#070b14]/80 p-6 backdrop-blur-xl">
            <div className="mb-6 flex items-center gap-3 border-b border-[#00f0ff]/20 pb-4">
              <FileSignature className="h-5 w-5 text-[#00f0ff]" />
              <h2 className="text-[14px] font-black uppercase tracking-[0.3em] text-[#00f0ff]">NEGOTIATION ENGINE</h2>
            </div>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {[
                "Clarification Requests",
                "Negotiation Email Drafts",
                "Exception Language",
                "Scope Protection Language",
                "Subcontractor Protection",
                "Pricing Defense Language"
              ].map((action, i) => (
                <button key={i} className="flex items-center justify-between rounded border border-[#00f0ff]/20 bg-[#00f0ff]/5 p-3 text-left transition hover:border-[#00f0ff]/50 hover:bg-[#00f0ff]/10">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-white/80">{action}</span>
                  <Zap className="h-3 w-3 text-[#00f0ff]" />
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-8">
          
          {/* 4. RISK & COMPLIANCE FLAGS */}
          <div className="rounded-xl border border-[#00D1FF]/20 bg-[#070b14]/80 p-6 backdrop-blur-xl">
            <div className="mb-6 flex items-center gap-3 border-b border-[#00D1FF]/20 pb-4">
              <ShieldAlert className="h-5 w-5 text-[#00D1FF]" />
              <h2 className="text-[14px] font-black uppercase tracking-[0.3em] text-[#00D1FF]">RISK & COMPLIANCE FLAGS</h2>
            </div>
            <div className="space-y-3">
              {[
                { label: "Prevailing Wage", icon: <Scale className="h-4 w-4 text-yellow-500" />, status: "VERIFY" },
                { label: "Worker Classification", icon: <UserCheck className="h-4 w-4 text-green-500" />, status: "CLEAR" },
                { label: "Provider Classification", icon: <UserCheck className="h-4 w-4 text-green-500" />, status: "CLEAR" },
                { label: "Insurance / Bonding", icon: <Shield className="h-4 w-4 text-[#00D1FF]" />, status: "HIGH RISK" },
                { label: "Indemnity Traps", icon: <AlertTriangle className="h-4 w-4 text-[#00D1FF]" />, status: "FLAGGED" },
                { label: "Liquidated Damages", icon: <AlertTriangle className="h-4 w-4 text-yellow-500" />, status: "REVIEW" },
                { label: "Marketplace Staffing Burden", icon: <HardHat className="h-4 w-4 text-green-500" />, status: "CLEAR" },
                { label: "Change-Order Leverage", icon: <Zap className="h-4 w-4 text-[#00f0ff]" />, status: "STRONG" }
              ].map((flag, i) => (
                <div key={i} className="flex items-center justify-between rounded border border-white/5 bg-white/5 p-3">
                  <div className="flex items-center gap-3">
                    {flag.icon}
                    <span className="text-[11px] font-bold uppercase tracking-wider text-white/80">{flag.label}</span>
                  </div>
                  <span className={`text-[9px] font-black uppercase tracking-widest ${
                    flag.status === 'CLEAR' || flag.status === 'STRONG' ? 'text-green-400' :
                    flag.status === 'REVIEW' || flag.status === 'VERIFY' ? 'text-yellow-400' :
                    'text-[#7dd3fc]'
                  }`}>
                    {flag.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* 5. PREMIUM ESCALATION PANEL */}
          <div className="rounded-xl border border-[#00f0ff]/50 bg-gradient-to-b from-[#00f0ff]/10 to-transparent p-6 backdrop-blur-xl relative overflow-hidden">
            <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-[#00f0ff]/20 blur-3xl" />
            <div className="mb-6 flex items-center gap-3 border-b border-[#00f0ff]/30 pb-4 relative z-10">
              <div className="flex h-8 w-8 items-center justify-center rounded bg-[#00f0ff] text-black">
                <Shield className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-[14px] font-black uppercase tracking-[0.3em] text-[#00f0ff]">HUMAN BID STRATEGIST</h2>
                <p className="text-[9px] font-bold uppercase tracking-widest text-white/50">ELITE PREMIUM SERVICE</p>
              </div>
            </div>
            <div className="space-y-4 relative z-10">
              <button className="w-full rounded border border-[#00f0ff]/30 bg-[#0b1120]/80 p-4 text-center transition hover:bg-[#00f0ff]/20">
                <span className="text-[12px] font-black uppercase tracking-widest text-white">Priority Review</span>
              </button>
              <button className="w-full rounded border border-[#00f0ff]/30 bg-[#0b1120]/80 p-4 text-center transition hover:bg-[#00f0ff]/20">
                <span className="text-[12px] font-black uppercase tracking-widest text-white">White-Glove Packet Build</span>
              </button>
              <button className="w-full rounded border border-[#00f0ff] bg-[#00f0ff] p-4 text-center shadow-[0_0_20px_rgba(0,240,255,0.3)] transition hover:scale-[1.02]">
                <span className="text-[12px] font-black uppercase tracking-widest text-black">Escalate to Strategic Review</span>
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
