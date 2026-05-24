import React, { useEffect, useState, Component, ErrorInfo, ReactNode } from "react";
import {
  Zap,
  Shield,
  Activity,
  Terminal,
  Flag,
  Cpu,
  CheckCircle2,
  Search,
  Eye,
  Lock,
  FileCheck,
  DollarSign,
  ChevronRight,
  Layers,
  Building2,
  ImageIcon,
  AlertCircle,
  CreditCard,
  TrendingUp,
  MapPin,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { LogoGenerator } from "./components/LogoGenerator";
import { ImageEditor } from "./components/ImageEditor";
import { BrandPoster } from "./components/BrandPoster";
import { DispatchMap } from "./components/DispatchMap";
import { AIEstimator } from "./components/AIEstimator";
import { PremiumContractor } from "./components/PremiumContractor";
import { Sparks } from "./components/Sparks";
import { GovBidView } from "./components/GovBidView";
import { JobPostingForm } from "./components/JobPostingForm";
import { JobApplications } from "./components/JobApplications";
import { JobMatching } from "./components/JobMatching";
import { ContractChecklist } from "./components/ContractChecklist";
import { ContractChat } from "./components/ContractChat";
import { PaymentCheckout } from "./components/PaymentCheckout";
import { PaymentHistory } from "./components/PaymentHistory";
import { jwtDecode } from 'jwt-decode';
import socket from "./lib/socket";

import { BlackInkLedger } from "./components/BlackInkLedger";

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

// Error Boundary Component
class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false, error: null };

  constructor(props: ErrorBoundaryProps) {
    super(props);
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex h-screen w-screen flex-col items-center justify-center bg-[#0a0a1f] p-6 text-white">
          <AlertCircle className="mb-4 h-16 w-16 text-[#ff00ff]" />
          <h1 className="mb-2 text-2xl font-black uppercase tracking-tighter">System Failure Detected</h1>
          <p className="mb-6 text-center text-sm text-white/60 max-w-md">
            The GigGrow interface has encountered a critical error. Our systems are attempting to recover.
          </p>
          <div className="rounded-sm border border-[#ff00ff]/30 bg-[#ff00ff]/5 p-4 font-mono text-[10px] text-[#ff00ff]">
            {this.state.error?.message}
          </div>
          <button 
            onClick={() => window.location.reload()}
            className="mt-8 rounded-sm border border-[#00f0ff] bg-[#00f0ff]/10 px-8 py-3 text-[10px] font-black uppercase tracking-[0.2em] text-[#00f0ff] hover:bg-[#00f0ff]/20"
          >
            Reboot Interface
          </button>
        </div>
      );
    }

    return (this as any).props.children;
  }
}

export default function App() {
  return (
    <ErrorBoundary>
      <AppContent />
    </ErrorBoundary>
  );
}

function AppContent() {
  const [heartbeat, setHeartbeat] = useState("");
  const [isBooting, setIsBooting] = useState(false);
  const [isPosterOpen, setIsPosterOpen] = useState(false);
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [signals, setSignals] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'DISPATCH' | 'OPERATORS' | 'INTEL' | 'GOVBID' | 'CONTRACTS' | 'JOBS' | 'MATCHES'>('DISPATCH');

  useEffect(() => {
    socket.on('job:broadcast', (job) => {
      setSignals(prev => [job, ...prev].slice(0, 5));
    });
    return () => {
      socket.off('job:broadcast');
    };
  }, []);
  const [generatedLogo, setGeneratedLogo] = useState<string | null>(null);

  useEffect(() => {
    // Load generated logo if it exists
    const savedLogo = localStorage.getItem('giggrow_4k_logo');
    if (savedLogo) {
      setGeneratedLogo(savedLogo);
      
      // Update favicon
      const favicon = document.querySelector('link[rel="icon"]');
      if (favicon) {
        favicon.setAttribute('href', savedLogo);
      }
    }

    const update = () =>
      setHeartbeat(
        new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );

    update();
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleBoot = () => {
    setIsBooting(true);
    setTimeout(() => setIsBooting(false), 2200);
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0a0a1f] text-white font-sans">
      {/* ===== GLOBAL BACKGROUND ===== */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(0,240,255,0.15),transparent_35%),radial-gradient(circle_at_80%_20%,rgba(0,176,255,0.12),transparent_35%),radial-gradient(circle_at_50%_80%,rgba(0,255,255,0.08),transparent_45%)]" />

      {/* ===== BIG WAVY NEON FLAG ===== */}
      <div className="absolute inset-0 opacity-[0.22] pointer-events-none flag-layer mix-blend-screen">
        <svg
          className="h-full w-full"
          viewBox="0 0 1600 900"
          preserveAspectRatio="xMidYMid slice"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <filter id="flagWave">
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.004 0.02"
                numOctaves="3"
                seed="8"
                result="noise"
              />
              <feDisplacementMap
                in="SourceGraphic"
                in2="noise"
                scale="38"
                xChannelSelector="R"
                yChannelSelector="G"
              />
            </filter>

            <linearGradient id="flagShade" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgba(255,255,255,0.18)" />
              <stop offset="40%" stopColor="rgba(255,255,255,0.05)" />
              <stop offset="100%" stopColor="rgba(0,0,0,0.35)" />
            </linearGradient>
          </defs>

          <g filter="url(#flagWave)">
            {/* stripes */}
            {Array.from({ length: 13 }).map((_, i) => (
              <rect
                key={i}
                x="0"
                y={i * (900 / 13)}
                width="1600"
                height={900 / 13}
                fill={i % 2 === 0 ? "#ff003c" : "#ffffff"}
                opacity={i % 2 === 0 ? 0.8 : 0.6}
              />
            ))}

            {/* canton */}
            <rect x="0" y="0" width="640" height="485" fill="#0033ff" opacity="0.9" />

            {/* stars */}
            {Array.from({ length: 9 }).map((_, row) =>
              Array.from({ length: row % 2 === 0 ? 6 : 5 }).map((__, col) => {
                const x = row % 2 === 0 ? 55 + col * 95 : 100 + col * 95;
                const y = 35 + row * 50;
                return (
                  <circle
                    key={`${row}-${col}`}
                    cx={x}
                    cy={y}
                    r="4"
                    fill="white"
                    opacity="0.85"
                  />
                );
              })
            )}

            <rect x="0" y="0" width="1600" height="900" fill="url(#flagShade)" />
          </g>
        </svg>
      </div>

      {/* ===== SPARKS ===== */}
      <Sparks />

      {/* ===== DARK OVERLAY FOR READABILITY ===== */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/70 to-black/95 pointer-events-none z-10" />

      {/* ===== NAV ===== */}
      <header className="relative z-40 border-b border-[#1f6fff]/20 bg-black/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 md:px-10">
          <div className="flex items-center gap-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-full border border-[#38bdf8]/50 bg-[#071428] shadow-[0_0_25px_rgba(0,153,255,0.25)]">
              <Zap className="h-5 w-5 text-[#38bdf8]" />
            </div>

            <div className="leading-tight">
              <div className="text-[10px] font-black uppercase tracking-[0.45em] text-[#7dd3fc]">
                Sovereign Marketplace Command
              </div>
              <div className="text-2xl font-black uppercase tracking-tight">
                GIGGROW <span className="text-white/65">MARKETPLACE OS</span>
              </div>
            </div>
          </div>

          <nav className="hidden items-center gap-10 text-[11px] font-black uppercase tracking-[0.35em] text-white/70 lg:flex">
            {['DISPATCH', 'OPERATORS', 'INTEL', 'GOVBID', 'CONTRACTS', 'JOBS', 'MATCHES'].map((tab) => {
              const labelMap: Record<string, string> = { DISPATCH: 'MAP', OPERATORS: 'PROVIDERS', INTEL: 'INTEL', GOVBID: 'GOVBID', CONTRACTS: 'CONTRACTS', JOBS: 'OPPORTUNITIES', MATCHES: 'MATCHES' };
              return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`cursor-pointer transition hover:text-[#00f0ff] ${activeTab === tab ? 'text-[#00f0ff] border-b-2 border-[#00f0ff] pb-1' : ''}`}
              >
                {labelMap[tab] || tab}
              </button>
            )})}
          </nav>

          <div className="flex items-center gap-4">
            <div className="hidden items-center gap-2 rounded-full border border-[#00f0ff]/30 bg-[#00f0ff]/10 px-4 py-2 md:flex">
              <div className="h-2.5 w-2.5 rounded-full bg-[#00f0ff] shadow-[0_0_10px_rgba(0,240,255,0.9)] animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.35em] text-[#00f0ff]">
                Online
              </span>
            </div>

            <button className="rounded-md border border-[#00f0ff]/50 bg-gradient-to-r from-[#00f0ff] to-[#00b0ff] px-5 py-3 text-[10px] font-black uppercase tracking-[0.35em] text-[#0a0a1f] shadow-[0_0_35px_rgba(0,240,255,0.35)] transition hover:scale-[1.02] hover:shadow-[0_0_45px_rgba(0,255,255,0.55)] md:px-8">
              ACCESS TERMINAL
            </button>
          </div>
        </div>
      </header>

      {activeTab === 'GOVBID' ? (
        <GovBidView />
      ) : activeTab === 'MATCHES' ? (
        <section className="relative z-30 mx-auto max-w-7xl px-6 pt-10 md:px-10">
          <div className="mb-8">
            <h2 className="text-2xl font-black uppercase tracking-tight text-white">AI Opportunity Matches</h2>
            <p className="text-sm text-white/60">AI-powered opportunity recommendations based on your profile.</p>
          </div>
          <JobMatching />
        </section>
      ) : activeTab === 'JOBS' ? (
        <section className="relative z-30 mx-auto max-w-7xl px-6 pt-10 md:px-10">
          <div className="mb-8">
            <h2 className="text-2xl font-black uppercase tracking-tight text-white">Opportunity Management</h2>
            <p className="text-sm text-white/60">Review proposals and manage your posted opportunities.</p>
          </div>
          {/* Using a placeholder job ID for demonstration */}
          <JobApplications jobId="demo-job-id" />
        </section>
      ) : activeTab === 'CONTRACTS' ? (
        <section className="relative z-30 mx-auto max-w-7xl px-6 pt-10 md:px-10 space-y-10">
          <div className="mb-8">
            <h2 className="text-2xl font-black uppercase tracking-tight text-white">Contract Execution</h2>
            <p className="text-sm text-white/60">Manage tasks and track completion for active contracts.</p>
          </div>
          {/* Using a placeholder contract ID for demonstration */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2 space-y-10">
              <ContractChecklist contractId="demo-contract-id" userRole="CLIENT" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <PaymentCheckout 
                  contractId="demo-contract-id" 
                  amount={450.00} 
                  onPaymentComplete={() => alert('Payment Successful!')} 
                />
                <PaymentHistory 
                  contractId="demo-contract-id" 
                  userRole="CLIENT" 
                />
              </div>
            </div>
            <ContractChat contractId="demo-contract-id" currentUserId={jwtDecode<{userId: string}>(localStorage.getItem('giggrow_token') || '').userId} />
          </div>
        </section>
      ) : activeTab === 'INTEL' ? (
        <section className="relative z-30 mx-auto max-w-7xl px-6 pt-10 md:px-10">
          <div className="mb-8">
            <h2 className="text-2xl font-black uppercase tracking-tight text-white italic">MARKETPLACE <span className="text-[#00f0ff]">INTELLIGENCE</span></h2>
            <p className="text-sm text-white/50 tracking-widest uppercase font-bold">Forensic monitoring of revenue, settlements, and system health.</p>
          </div>
          <BlackInkLedger />
        </section>
      ) : activeTab === 'OPERATORS' ? (
        <section id="providers" className="relative z-30 mx-auto max-w-7xl px-6 py-10 md:px-10">
          <div className="mb-12">
            <div className="text-[11px] font-black uppercase tracking-[0.4em] text-[#00f0ff]">The Provider Network</div>
            <h2 className="mt-4 text-4xl font-black uppercase tracking-tight md:text-6xl">
              ELITE <span className="text-white/40">OPERATORS</span>
            </h2>
            <p className="mt-6 max-w-2xl text-lg text-white/60">
              Independent businesses ready to respond with verified identity, documented readiness, and evidence-backed completion.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                role: "Heavy Infrastructure",
                name: "Caleb Miller",
                bio: "12 years in steel fabrication and site command. Verified expert in high-rise structural assembly.",
                image: "https://picsum.photos/seed/construction_worker/600/800",
                status: "STANDBY"
              },
              {
                role: "Strategic Ops",
                name: "Sarah Chen",
                bio: "Logistics operator specializing in national fleet deployment and rapid response management.",
                image: "https://picsum.photos/seed/operations_lead/600/800",
                status: "ONLINE"
              },
              {
                role: "Digital Admin",
                name: "Marcus Thorne",
                bio: "Expert in contract forensic analysis, biometric verification, and secure payment rails.",
                image: "https://picsum.photos/seed/office_admin/600/800",
                status: "ON MISSION"
              },
              {
                role: "Systems Tech",
                name: "Elena Rodriguez",
                bio: "Master technician for heavy industrial systems. Specialized in automated diagnostic protocols.",
                image: "https://picsum.photos/seed/mechanic_tech/600/800",
                status: "ONLINE"
              }
            ].map((worker, i) => (
              <div key={i} className="group relative overflow-hidden rounded-2xl border border-white/10 bg-[#0a0a1f]/60 transition hover:border-[#00f0ff]/40">
                <div className="aspect-[3/4] overflow-hidden">
                  <img 
                    src={worker.image} 
                    alt={worker.name}
                    className="h-full w-full object-cover grayscale transition duration-500 group-hover:grayscale-0 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a1f] via-transparent to-transparent opacity-80" />
                  <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-2 py-1 rounded border border-white/10 text-[8px] font-black text-[#00f0ff] uppercase tracking-widest">
                    {worker.status}
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="text-[10px] font-black uppercase tracking-[0.3em] text-[#00f0ff]">{worker.role}</div>
                  <h3 className="mt-1 text-xl font-black uppercase tracking-tight text-white">{worker.name}</h3>
                  <p className="mt-3 text-xs leading-relaxed text-white/50 opacity-0 transition duration-300 group-hover:opacity-100">
                    {worker.bio}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : (
        <>
          {/* ===== REAL-TIME DISPATCH MAP ===== */}
          <section className="relative z-30 mx-auto max-w-7xl px-6 pt-10 md:px-10">
        <div className="mb-8 flex items-end justify-between border-b border-[#00f0ff]/20 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-3 text-[#00f0ff]">
              <Zap className="h-5 w-5 animate-pulse" />
              <h2 className="text-[14px] font-black uppercase tracking-[0.4em]">REAL-TIME OPPORTUNITY MAP // SECTOR 7</h2>
            </div>
            <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-white/40 italic">
              LIVE PROVIDER VISIBILITY & OPPORTUNITY BROADCASTING
            </p>
          </div>
          <div className="text-right">
            <div className="text-[16px] font-black text-[#00f0ff]">{signals.length}</div>
            <div className="text-[8px] font-bold uppercase tracking-[0.1em] text-white/40">ACTIVE SIGNALS</div>
          </div>
        </div>
        
        <button 
          onClick={() => setIsMapOpen(true)}
          className="w-full flex items-center justify-center gap-3 rounded-xl border border-[#00f0ff]/30 bg-[#00f0ff]/5 py-8 text-[14px] font-black uppercase tracking-[0.3em] text-[#00f0ff] hover:bg-[#00f0ff]/10 transition-all"
        >
          <MapPin className="h-6 w-6" />
          OPEN OPPORTUNITY MAP TOOL
        </button>

        <AnimatePresence>
          {isMapOpen && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-6 backdrop-blur-sm"
            >
              <div className="relative w-full max-w-6xl h-[80vh] rounded-2xl border border-[#00f0ff]/30 bg-[#0a0a1f] overflow-hidden flex flex-col">
                <div className="flex items-center justify-between border-b border-[#00f0ff]/20 p-4 bg-black/50">
                  <div className="flex items-center gap-3 text-[#00f0ff]">
                    <MapPin className="h-5 w-5" />
                    <span className="text-[12px] font-black uppercase tracking-[0.3em]">OPPORTUNITY MAP TOOL</span>
                  </div>
                  <button 
                    onClick={() => setIsMapOpen(false)}
                    className="text-white/50 hover:text-white transition-colors"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
                <div className="flex-1 relative">
                  <DispatchMap />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* ===== JOB POSTING ===== */}
      <section className="relative z-30 mx-auto max-w-7xl px-6 pt-10 md:px-10">
        <JobPostingForm />
      </section>

      {/* ===== HERO ===== */}
      <main className="relative z-30 mx-auto max-w-7xl px-6 pb-24 pt-10 md:px-10 md:pt-14">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12">
          {/* LEFT */}
          <section className="lg:col-span-7">
            {/* Badge */}
            <div className="mb-6 flex flex-wrap gap-3">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#00f0ff]/30 bg-[#0b1120]/70 px-4 py-2 backdrop-blur-md">
                <Flag className="h-4 w-4 text-[#00f0ff]" />
                <span className="text-[10px] font-black uppercase tracking-[0.35em] text-[#00f0ff]">
                  Marketplace for Independent Provider Businesses
                </span>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full border border-[#00f0ff]/30 bg-[#00f0ff]/10 px-4 py-2 backdrop-blur-md">
                <div className="h-1.5 w-1.5 rounded-full bg-[#00f0ff] animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-[0.35em] text-[#00f0ff]">
                  MADE IN USA
                </span>
              </div>
            </div>

            {/* Logo + Image Row */}
            <div className="bg-[#030712]/95 border border-[#00D1FF]/20 rounded-xl overflow-hidden shadow-[0_0_40px_rgba(0,209,255,0.08)] backdrop-blur-3xl mb-8">
              <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
                <span className="text-[11px] font-black text-[#00D1FF] uppercase tracking-[0.45em]">
                  GIGGROW // BRAND ASSET
                </span>
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                  Cinematic Poster
                </span>
              </div>

              <div className="p-6">
                <div className="mx-auto max-w-[460px] overflow-hidden rounded-xl border border-[#00D1FF]/15 bg-black shadow-[0_0_30px_rgba(0,209,255,0.08)]">
                  <img
                    src={generatedLogo || "/giggrow.png"}
                    alt="GigGrow provider network poster"
                    className="h-auto w-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>

                <div className="mt-5 space-y-2">
                  <h3 className="text-lg font-black uppercase tracking-[0.18em] text-white">
                    Patriotic Provider Network Poster
                  </h3>
                  <p className="text-sm leading-6 text-gray-400">
                    Official GigGrow visual asset featuring the electric provider-network lineup,
                    sovereign flag energy, and brand mascot composition.
                  </p>
                </div>
              </div>
            </div>

            {/* Headline */}
            <h2 className="text-7xl md:text-8xl font-black tracking-tighter leading-[0.85] uppercase italic">
              AMERICA&apos;S <br />
              <span className="text-[#00D1FF] drop-shadow-[0_0_18px_rgba(0,209,255,0.45)]">
                MOST ELITE AI
              </span>
              <br />
              <span className="text-white">B2B ENGAGEMENT PLATFORM.</span>
            </h2>

            {/* Subcopy */}
            <p className="mt-8 max-w-3xl text-lg leading-9 text-white/78 md:text-2xl md:leading-10">
              The Sovereign Marketplace for high-skilled independent businesses. 
              Powered by AI mapping and instant handshake negotiation. 
              Engage verified professionals at a moment&apos;s notice with total transparency.
            </p>

            {/* Buttons */}
            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <button
                onClick={handleBoot}
                className="group inline-flex items-center justify-center rounded-md border border-[#00f0ff]/50 bg-gradient-to-r from-[#00f0ff] to-[#00b0ff] px-8 py-5 text-[11px] font-black uppercase tracking-[0.35em] text-[#0a0a1f] shadow-[0_0_40px_rgba(0,240,255,0.4)] transition hover:scale-[1.02] hover:shadow-[0_0_55px_rgba(0,255,255,0.55)]"
              >
                {isBooting ? "INITIALIZING PLATFORM..." : "INITIALIZE PLATFORM"}
                <Zap className="ml-3 h-4 w-4 transition group-hover:rotate-12" />
              </button>

              <button 
                onClick={() => setIsPosterOpen(true)}
                className="inline-flex items-center justify-center rounded-md border border-[#00f0ff]/30 bg-black/40 px-8 py-5 text-[11px] font-black uppercase tracking-[0.35em] text-white shadow-[0_0_20px_rgba(255,255,255,0.04)] transition hover:border-[#00f0ff]/50 hover:bg-[#0d0d2b]/70 hover:text-[#00f0ff]"
              >
                GENERATE BRAND POSTER
                <ImageIcon className="ml-3 h-4 w-4" />
              </button>
            </div>

            <BrandPoster isOpen={isPosterOpen} onClose={() => setIsPosterOpen(false)} />

            {/* Bottom Stripe */}
            <div className="mt-10 grid grid-cols-1 gap-4 border-t border-white/10 pt-6 md:grid-cols-3">
              <Stat label="MARKETPLACE" value="NEUTRAL" valueClass="text-white" />
              <Stat label="INTELLIGENCE" value="FORENSIC" valueClass="text-[#00f0ff]" />
              <Stat label="SECURITY" value="VAULTED" valueClass="text-[#00b0ff]" />
            </div>
          </section>

          {/* RIGHT */}
          <section className="lg:col-span-5">
            <div className="command-panel relative overflow-hidden rounded-2xl p-6 md:p-8">
              <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-[#00b0ff]/10 blur-3xl" />
              <div className="absolute -left-10 bottom-0 h-40 w-40 rounded-full bg-[#00f0ff]/10 blur-3xl" />

              <div className="relative flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Activity className="h-5 w-5 text-[#00f0ff]" />
                  <span className="text-[11px] font-black uppercase tracking-[0.35em] text-white/80">
                    System Health & Signal Feed
                  </span>
                </div>

                <div className="h-3 w-3 rounded-full bg-[#00f0ff] shadow-[0_0_15px_rgba(0,240,255,1)] animate-pulse" />
              </div>

              <div className="mt-8 space-y-6">
                <ProgressRow label="Verification Rails" value="ACTIVE" width="94%" />
                <ProgressRow label="Marketplace Core" value="SYNCED" width="88%" />
                <ProgressRow label="Opportunity Engine" value="ONLINE" width="100%" />
              </div>

              <div className="mt-8 space-y-4">
                <div className="flex items-center gap-3 text-[#ff00ff]">
                  <Zap className="h-4 w-4" />
                  <h3 className="text-[10px] font-black uppercase tracking-[0.3em]">LIVE SIGNAL FEED</h3>
                </div>
                <div className="space-y-2">
                  {signals.length === 0 ? (
                    <div className="rounded-sm border border-white/5 bg-white/5 p-4 text-center text-[10px] uppercase tracking-[0.1em] text-white/20 italic">
                      WAITING FOR BROADCAST...
                    </div>
                  ) : (
                    signals.map((s, i) => (
                      <div key={i} className="flex items-center justify-between rounded-sm border border-[#ff00ff]/20 bg-[#ff00ff]/5 p-3 animate-in slide-in-from-right-4">
                        <div className="flex items-center gap-3">
                          <Zap className="h-3 w-3 text-[#ff00ff]" />
                          <span className="text-[10px] font-bold text-white uppercase">{s.title}</span>
                        </div>
                        <span className="text-[9px] font-black text-[#ff00ff]">$450.00</span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="mt-8 grid grid-cols-2 gap-4">
                <MetricCard label="UPTIME" value="99.99%" />
                <MetricCard label="LATENCY" value="24ms" />
              </div>

              <div className="mt-5 rounded-xl border border-white/10 bg-black/30 px-5 py-4">
                <div className="flex items-center gap-3">
                  <div className="h-2.5 w-2.5 rounded-full bg-[#00f0ff] shadow-[0_0_12px_rgba(0,240,255,0.9)]" />
                  <span className="text-[10px] font-black uppercase tracking-[0.25em] text-white/65">
                    HEARTBEAT:
                  </span>
                  <span className="text-sm font-semibold text-white">{heartbeat}</span>
                </div>
              </div>

              <button className="mt-6 flex w-full items-center justify-center rounded-md border border-[#00f0ff]/25 bg-[#071428]/70 py-4 text-[10px] font-black uppercase tracking-[0.35em] text-[#00f0ff] transition hover:border-[#00f0ff]/50 hover:bg-[#0b1730]">
                <Terminal className="mr-3 h-4 w-4" />
                VIEW SYSTEM LOGS
              </button>
            </div>

            {/* Secondary panel */}
            <div className="mt-6 overflow-hidden rounded-2xl border border-[#00f0ff]/20 bg-[#0a0a0f]/70 p-6 shadow-[0_0_40px_rgba(0,240,255,0.06)] backdrop-blur-xl">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-[0.35em] text-[#00f0ff]">
                  NATIONAL STATUS
                </span>
                <Shield className="h-5 w-5 text-[#00f0ff]" />
              </div>

              <div className="space-y-3">
                <StatusRow text="Verified marketplace-first architecture" />
                <StatusRow text="Evidence-gated completion workflow" />
                <StatusRow text="Stripe + Polygon payment rail readiness" />
                <StatusRow text="Voice covenant gate support enabled" />
              </div>

              <button className="w-full mt-10 py-6 bg-[#00D1FF] text-black text-[12px] font-black uppercase tracking-widest hover:bg-white transition-all shadow-[0_0_30px_rgba(0,209,255,0.35)] relative z-10">
                ISSUE NATIONAL HAZARD NOTICE
              </button>
            </div>
          </section>
        </div>
      </main>

      {/* ===== INTELLIGENCE SECTION ===== */}
      <section id="intelligence" className="relative z-30 mx-auto max-w-7xl px-6 py-24 md:px-10">
        <div className="mb-16">
          <div className="flex items-center gap-3 text-[#00f0ff]">
            <Search className="h-5 w-5" />
            <span className="text-[11px] font-black uppercase tracking-[0.4em]">Forensic Intelligence</span>
          </div>
          <h2 className="mt-4 text-4xl font-black uppercase tracking-tight md:text-6xl">
            DEBBIE CORE <span className="text-white/40">INTELLIGENCE</span>
          </h2>
          <p className="mt-6 max-w-2xl text-lg text-white/60">
            The GigGrow Intelligence layer provides real-time forensic analysis of every contract, 
            every payment, and every completion event. No more guessing. Total visibility.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <IntelligenceCard 
            icon={<Eye className="h-6 w-6" />}
            title="Visual Verification"
            description="AI-powered image analysis verifies work completion against contract specs in real-time."
          />
          <IntelligenceCard 
            icon={<Lock className="h-6 w-6" />}
            title="Voice Covenant"
            description="Biometric voice signatures secure high-value contract milestones and payment releases."
          />
          <IntelligenceCard 
            icon={<FileCheck className="h-6 w-6" />}
            title="Evidence Engine"
            description="Automatically compiles a forensic audit trail for every job, protecting both sides."
          />
        </div>
      </section>

      {/* ===== COMMAND CENTER: MEMBERSHIP & AI ESTIMATION ===== */}
      <section id="command-center" className="relative z-30 mx-auto max-w-7xl px-6 py-24 md:px-10">
        <div className="mb-16">
          <div className="flex items-center gap-3 text-[#00f0ff]">
            <Zap className="h-5 w-5" />
            <span className="text-[11px] font-black uppercase tracking-[0.4em]">Strategic Command</span>
          </div>
          <h2 className="mt-4 text-4xl font-black uppercase tracking-tight md:text-6xl">
            CONTRACTOR <span className="text-white/40">COMMAND CENTER</span>
          </h2>
          <p className="mt-6 max-w-2xl text-lg text-white/60">
            Manage your elite membership and leverage our AI Strategic Estimator for instant, 
            forensic-grade T&M bids. Scale your operation with precision.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <AIEstimator />
          <PremiumContractor />
        </div>
      </section>

      {/* ===== PLATFORM PILLARS ===== */}
      <section id="platform" className="relative z-30 mx-auto max-w-7xl px-6 py-24 md:px-10">
        <div className="rounded-3xl border border-[#00f0ff]/20 bg-[#050913]/60 p-8 backdrop-blur-3xl md:p-16">
          <div className="grid grid-cols-1 gap-16 lg:grid-cols-2">
            <div>
              <div className="text-[11px] font-black uppercase tracking-[0.4em] text-[#00b0ff]">Platform Pillars</div>
              <h2 className="mt-4 text-4xl font-black uppercase tracking-tight md:text-6xl">
                BUILT FOR <span className="text-[#00f0ff]">COMMAND.</span>
              </h2>
              <p className="mt-8 text-xl leading-relaxed text-white/70">
                GigGrow isn't just a marketplace. It's a command center for independent provider businesses. 
                We provide the infrastructure that allows providers to scale with confidence.
              </p>
              
              <div className="mt-12 space-y-8">
                <PillarCard 
                  icon={<Shield className="h-6 w-6" />}
                  title="Verified Identity"
                  text="Every provider and client is vetted through national security-grade identity protocols."
                />
                <PillarCard 
                  icon={<DollarSign className="h-6 w-6" />}
                  title="Instant Liquidity"
                  text="Payments move at the speed of work. No 30-day waits. No chasing checks."
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="space-y-6">
                <div className="h-64 rounded-2xl border border-white/10 bg-gradient-to-br from-[#00b0ff]/20 to-transparent p-6">
                  <Activity className="h-8 w-8 text-[#00f0ff]" />
                  <div className="mt-4 text-sm font-black uppercase tracking-widest">Real-time Tracking</div>
                  <div className="mt-2 text-xs text-white/50">Monitor every provider and opportunity across 50 states from a single dashboard.</div>
                </div>
                <div className="h-80 rounded-2xl border border-white/10 bg-gradient-to-br from-[#00b0ff]/10 to-transparent p-6">
                  <Building2 className="h-8 w-8 text-[#00b0ff]" />
                  <div className="mt-4 text-sm font-black uppercase tracking-widest">Enterprise Ready</div>
                  <div className="mt-2 text-xs text-white/50">Scale from a single operator to a national fleet with built-in compliance.</div>
                </div>
              </div>
              <div className="mt-12 space-y-6 sm:mt-0">
                <div className="h-80 rounded-2xl border border-white/10 bg-gradient-to-br from-[#00f0ff]/10 to-transparent p-6">
                  <CheckCircle2 className="h-8 w-8 text-[#00f0ff]" />
                  <div className="mt-4 text-sm font-black uppercase tracking-widest">Verified Completion</div>
                  <div className="mt-2 text-xs text-white/50">Smart contracts only release funds when evidence meets the standard.</div>
                </div>
                <div className="h-64 rounded-2xl border border-white/10 bg-gradient-to-br from-[#00b0ff]/10 to-transparent p-6">
                  <Layers className="h-8 w-8 text-[#00b0ff]" />
                  <div className="mt-4 text-sm font-black uppercase tracking-widest">Modular Stack</div>
                  <div className="mt-2 text-xs text-white/50">Integrate your existing tools via our high-performance API layer.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== WORKFLOW SECTION ===== */}
      <section id="workflow" className="relative z-30 mx-auto max-w-7xl px-6 py-24 md:px-10">
        <div className="text-center">
          <div className="text-[11px] font-black uppercase tracking-[0.4em] text-[#00f0ff]">The Protocol</div>
          <h2 className="mt-4 text-4xl font-black uppercase tracking-tight md:text-6xl">
            WORKFLOW <span className="text-white/40">EXECUTION</span>
          </h2>
        </div>

        <div className="mt-20 grid grid-cols-1 gap-8 md:grid-cols-4">
          {[
            { step: "01", title: "Deploy", desc: "Post verified requirements to the national command network." },
            { step: "02", title: "Verify", desc: "Providers clear identity and capability gates instantly." },
            { step: "03", title: "Execute", desc: "Real-time evidence streaming ensures work meets the spec." },
            { step: "04", title: "Settle", desc: "Automated payment release via secure financial rails." },
          ].map((item, i) => (
            <div key={i} className="relative group">
              <div className="text-6xl font-black text-white/5 transition group-hover:text-[#00f0ff]/10">{item.step}</div>
              <div className="mt-[-20px] pl-4">
                <h3 className="text-xl font-black uppercase tracking-widest text-white">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-white/50">{item.desc}</p>
              </div>
              {i < 3 && (
                <div className="absolute right-0 top-1/2 hidden h-px w-12 bg-white/10 md:block" />
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ===== STACK SECTION ===== */}
      <section id="stack" className="relative z-30 mx-auto max-w-7xl px-6 py-24 md:px-10">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          <div>
            <h2 className="text-4xl font-black uppercase tracking-tight md:text-5xl">
              THE <span className="text-[#00f0ff]">GIGGROW</span> STACK
            </h2>
            <p className="mt-6 text-lg text-white/60">
              We leverage the most advanced technologies to ensure the provider network has the tools it needs to dominate the 21st century.
            </p>
            <div className="mt-10 space-y-4">
              <StackItem label="Core Engine" value="Rust / High-Concurrency" />
              <StackItem label="Intelligence" value="Debbie Core v4.2 (LLM)" />
              <StackItem label="Payments" value="Stripe Connect / Polygon" />
              <StackItem label="Identity" value="NIST-Compliant Biometrics" />
            </div>
          </div>
          <div className="flex items-center justify-center">
            <div className="relative h-64 w-64 md:h-80 md:w-80">
              <div className="absolute inset-0 animate-spin-slow rounded-full border-2 border-dashed border-[#00f0ff]/20" />
              <div className="absolute inset-8 animate-spin-reverse rounded-full border-2 border-dashed border-[#00b0ff]/20" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Zap className="h-16 w-16 text-[#00f0ff] drop-shadow-[0_0_20px_rgba(0,240,255,0.5)]" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== PROVIDER PROFILES SECTION ===== */}
      <section id="providers" className="relative z-30 mx-auto max-w-7xl px-6 py-24 md:px-10">
        <div className="mb-16 text-center">
          <div className="text-[11px] font-black uppercase tracking-[0.4em] text-[#00f0ff]">The Provider Network</div>
          <h2 className="mt-4 text-4xl font-black uppercase tracking-tight md:text-6xl">
            ELITE <span className="text-white/40">OPERATORS</span>
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-white/60">
            Independent businesses ready to respond with verified identity, documented readiness, and evidence-backed completion.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              role: "Heavy Infrastructure",
              name: "Caleb Miller",
              bio: "12 years in steel fabrication and site command. Verified expert in high-rise structural assembly.",
              image: "https://picsum.photos/seed/construction_worker/600/800"
            },
            {
              role: "Strategic Ops",
              name: "Sarah Chen",
              bio: "Logistics operator specializing in national fleet deployment and rapid response management.",
              image: "https://picsum.photos/seed/operations_lead/600/800"
            },
            {
              role: "Digital Admin",
              name: "Marcus Thorne",
              bio: "Expert in contract forensic analysis, biometric verification, and secure payment rails.",
              image: "https://picsum.photos/seed/office_admin/600/800"
            },
            {
              role: "Systems Tech",
              name: "Elena Rodriguez",
              bio: "Master technician for heavy industrial systems. Specialized in automated diagnostic protocols.",
              image: "https://picsum.photos/seed/mechanic_tech/600/800"
            }
          ].map((worker, i) => (
            <div key={i} className="group relative overflow-hidden rounded-2xl border border-white/10 bg-[#0a0a1f]/60 transition hover:border-[#00f0ff]/40">
              <div className="aspect-[3/4] overflow-hidden">
                <img 
                  src={worker.image} 
                  alt={worker.name}
                  className="h-full w-full object-cover grayscale transition duration-500 group-hover:grayscale-0 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a1f] via-transparent to-transparent opacity-80" />
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <div className="text-[10px] font-black uppercase tracking-[0.3em] text-[#00f0ff]">{worker.role}</div>
                <h3 className="mt-1 text-xl font-black uppercase tracking-tight text-white">{worker.name}</h3>
                <p className="mt-3 text-xs leading-relaxed text-white/50 opacity-0 transition duration-300 group-hover:opacity-100">
                  {worker.bio}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== VISION LAB (AI TOOLS) ===== */}
      <section className="relative z-30 mx-auto max-w-7xl px-6 py-24 md:px-10">
        <div className="mb-12 text-center">
          <div className="text-[11px] font-black uppercase tracking-[0.4em] text-[#00f0ff]">Vision Lab</div>
          <h2 className="mt-4 text-3xl font-black uppercase tracking-tight md:text-5xl">
            BRAND <span className="text-white/40">COMMAND</span>
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-black/40 p-6 backdrop-blur-xl">
            <LogoGenerator />
          </div>
          <div className="rounded-2xl border border-white/10 bg-black/40 p-6 backdrop-blur-xl">
            <ImageEditor />
          </div>
        </div>
      </section>
      </>
      )}

      {/* ===== FOOTER BAR ===== */}
      <footer className="relative z-30 border-t border-[#00f0ff]/20 bg-black/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-6 py-4 md:px-10">
          <FooterMetric label="ACTIVE STATES" value="50" />
          <FooterMetric label="VERIFIED CREWS" value="14,228" />
          <FooterMetric label="PAYMENT RAILS" value="ARMED" />
          <FooterMetric label="VETERAN OWNED" value="100% P&T" />
        </div>
      </footer>
    </div>
  );
}

function ProgressRow({ label, value, width = "88%" }: { label: string; value: string; width?: string }) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/55">
          {label}
        </span>
        <span className="text-[10px] font-black uppercase tracking-[0.25em] text-[#00f0ff]">
          {value}
        </span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
        <div 
          className="h-full rounded-full bg-gradient-to-r from-[#00f0ff] to-[#00b0ff] shadow-[0_0_14px_rgba(0,240,255,0.6)] transition-all duration-1000 ease-out" 
          style={{ width }}
        />
      </div>
    </div>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-black/25 p-5">
      <div className="text-[10px] font-black uppercase tracking-[0.3em] text-white/45">
        {label}
      </div>
      <div className="mt-2 text-3xl font-black tracking-tight text-white">{value}</div>
    </div>
  );
}

function StatusRow({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-3 rounded-lg border border-white/5 bg-white/[0.02] px-4 py-3">
      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#00f0ff]" />
      <span className="text-sm text-white/75">{text}</span>
    </div>
  );
}

function Stat({
  label,
  value,
  valueClass,
}: {
  label: string;
  value: string;
  valueClass?: string;
}) {
  return (
    <div className="border-l border-white/10 pl-4 first:border-l-0 first:pl-0">
      <div className="text-[10px] font-black uppercase tracking-[0.35em] text-white/45">
        {label}
      </div>
      <div className={`mt-2 text-3xl font-black uppercase tracking-tight ${valueClass || "text-white"}`}>
        {value}
      </div>
    </div>
  );
}

function FooterMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center gap-3">
      <Cpu className="h-4 w-4 text-[#00f0ff]" />
      <span className="text-[10px] font-black uppercase tracking-[0.25em] text-white/55">
        {label}
      </span>
      <span className="text-[11px] font-black uppercase tracking-[0.15em] text-[#00f0ff]">
        {value}
      </span>
    </div>
  );
}

function IntelligenceCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="group rounded-2xl border border-white/10 bg-[#0a0a1f]/60 p-8 transition hover:border-[#00f0ff]/40 hover:bg-[#0d0d2b]/80">
      <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl border border-[#00f0ff]/30 bg-[#00f0ff]/10 text-[#00f0ff] transition group-hover:scale-110">
        {icon}
      </div>
      <h3 className="text-xl font-black uppercase tracking-widest text-white">{title}</h3>
      <p className="mt-4 text-sm leading-relaxed text-white/50">{description}</p>
    </div>
  );
}

function PillarCard({ icon, title, text }: { icon: React.ReactNode, title: string, text: string }) {
  return (
    <div className="flex gap-6">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[#00f0ff]/30 bg-[#00f0ff]/10 text-[#00f0ff]">
        {icon}
      </div>
      <div>
        <h3 className="text-lg font-black uppercase tracking-widest text-white">{title}</h3>
        <p className="mt-2 text-sm text-white/50">{text}</p>
      </div>
    </div>
  );
}

function StackItem({ label, value }: { label: string, value: string }) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-white/5 bg-white/[0.02] px-6 py-4">
      <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">{label}</span>
      <span className="text-sm font-bold text-[#00f0ff]">{value}</span>
      <ChevronRight className="h-4 w-4 text-white/20" />
    </div>
  );
}
