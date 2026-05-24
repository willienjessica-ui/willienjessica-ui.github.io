import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Phone, PhoneOff, Mic, MicOff, Video, VideoOff, MessageSquare, Shield, Activity, Lock, Wifi } from 'lucide-react';

interface CommunicationBridgeProps {
  participantName: string;
  participantRole: string;
  opportunityId: string;
  onClose: () => void;
}

export const CommunicationBridge: React.FC<CommunicationBridgeProps> = ({
  participantName,
  participantRole,
  opportunityId,
  onClose
}) => {
  const [status, setStatus] = useState<'CONNECTING' | 'SECURE_LINE_ACTIVE' | 'TERMINATING'>('CONNECTING');
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(true);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setStatus('SECURE_LINE_ACTIVE'), 2000);
    const interval = setInterval(() => {
      if (status === 'SECURE_LINE_ACTIVE') setDuration(d => d + 1);
    }, 1000);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [status]);

  const formatDuration = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleEndCall = () => {
    setStatus('TERMINATING');
    setTimeout(onClose, 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0a0a1f]/90 backdrop-blur-3xl p-6"
    >
      <div className="relative w-full max-w-4xl overflow-hidden rounded-3xl border border-[#00f0ff]/30 bg-black/80 shadow-[0_0_100px_rgba(0,240,255,0.15)] md:aspect-video flex flex-col md:flex-row">
        
        {/* Main Video/Signal Area */}
        <div className="relative flex-1 bg-[#0b1120] overflow-hidden">
          {/* Signal Overlay */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
            <div className="absolute top-0 left-0 w-full h-1 bg-[#00f0ff]/10 animate-scanline" style={{ animation: 'scan 4s linear infinite' }} />
          </div>

          <div className="absolute top-8 left-8 z-10 flex flex-col gap-2">
            <div className="flex items-center gap-2 bg-black/40 px-3 py-1 rounded-md backdrop-blur-md">
              <div className={`h-2 w-2 rounded-full ${status === 'SECURE_LINE_ACTIVE' ? 'bg-[#00f0ff] animate-pulse' : 'bg-yellow-500'}`} />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white">{status.replace('_', ' ')}</span>
            </div>
            <div className="flex items-center gap-2 bg-black/40 px-3 py-1 rounded-md backdrop-blur-md text-[10px] font-bold text-white/60">
              <Wifi className="h-3 w-3" />
              <span>SIGNAL: AES-256 ENCRYPTED</span>
            </div>
          </div>

          <div className="absolute top-8 right-8 z-10">
            <div className="flex flex-col items-end gap-1">
              <span className="text-[10px] font-black uppercase tracking-widest text-[#00f0ff]">{formatDuration(duration)}</span>
              <span className="text-[8px] font-bold text-white/30 uppercase">OP_ID: {opportunityId}</span>
            </div>
          </div>

          {/* Centered Profile/Mascot */}
          <div className="flex h-full items-center justify-center flex-col gap-6">
            <div className="relative">
              <div className="absolute -inset-4 animate-pulse rounded-full border border-[#00f0ff]/20" />
              <div className={`flex h-48 w-48 items-center justify-center rounded-full border-2 border-[#00f0ff]/40 bg-gradient-to-br from-[#00f0ff]/10 to-transparent ${status === 'TERMINATING' ? 'opacity-0 scale-90 transition-all duration-500' : ''}`}>
                <Shield className="h-20 w-20 text-[#00f0ff] opacity-40" />
              </div>
            </div>
            <div className="text-center">
              <h3 className="text-2xl font-black uppercase tracking-tight text-white">{participantName}</h3>
              <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#00f0ff] opacity-60">{participantRole}</p>
            </div>
          </div>

          {/* Video Controls Bar */}
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-6 bg-black/60 px-8 py-4 rounded-full border border-white/10 backdrop-blur-xl">
            <ControlBtn 
              icon={isMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />} 
              isActive={isMuted} 
              onClick={() => setIsMuted(!isMuted)} 
            />
            <ControlBtn 
              icon={isVideoOff ? <VideoOff className="h-5 w-5" /> : <Video className="h-5 w-5" />} 
              isActive={isVideoOff} 
              onClick={() => setIsVideoOff(!isVideoOff)} 
            />
            <button 
              onClick={handleEndCall}
              className="group flex h-14 w-14 items-center justify-center rounded-full bg-red-500 text-white transition-all hover:bg-red-600 hover:scale-110 shadow-[0_0_30px_rgba(239,68,68,0.4)]"
            >
              <PhoneOff className="h-6 w-6" />
            </button>
            <ControlBtn icon={<MessageSquare className="h-5 w-5" />} onClick={() => {}} />
            <div className="h-6 w-[1px] bg-white/10 mx-2" />
            <div className="flex flex-col items-center">
              <Wifi className="h-4 w-4 text-[#00f0ff]" />
              <span className="text-[8px] font-bold text-white/40">LINK</span>
            </div>
          </div>
        </div>

        {/* Tactical Intel Sidebar (B2B specific) */}
        <div className="w-full md:w-80 border-t md:border-t-0 md:border-l border-white/10 bg-[#050913] p-8 flex flex-col gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Activity className="h-4 w-4 text-[#00f0ff]" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white">Marketplace Intel</span>
            </div>
            <div className="space-y-4">
              <IntelRow label="Provider Score" value="9.8/10" color="#00f0ff" />
              <IntelRow label="Vetting Status" value="NIST LEVEL 3" color="#00f0ff" />
              <IntelRow label="On-Chain Escrow" value="READY" color="#00f0ff" />
            </div>
          </div>

          <div className="mt-auto">
            <div className="flex items-center gap-2 mb-4">
              <Lock className="h-4 w-4 text-[#ff00ff]" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white">Security Gate</span>
            </div>
            <p className="text-[9px] leading-relaxed text-white/40 uppercase tracking-widest">
              This line is sovereign-compliant. No third-party relays. Evidence engine is logging conversation milestones.
            </p>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes scan {
          from { transform: translateY(-100%); }
          to { transform: translateY(1000%); }
        }
      `}} />
    </motion.div>
  );
};

const ControlBtn: React.FC<{ icon: React.ReactNode; isActive?: boolean; onClick: () => void }> = ({ icon, isActive, onClick }) => (
  <button 
    onClick={onClick}
    className={`flex h-12 w-12 items-center justify-center rounded-full border transition-all hover:scale-110 ${isActive ? 'border-red-500/50 bg-red-500/10 text-red-500' : 'border-white/10 bg-white/5 text-white/60 hover:text-white hover:border-white/30'}`}
  >
    {icon}
  </button>
);

const IntelRow: React.FC<{ label: string; value: string; color: string }> = ({ label, value, color }) => (
  <div className="flex items-center justify-between border-b border-white/5 pb-2">
    <span className="text-[9px] font-bold uppercase tracking-widest text-white/40">{label}</span>
    <span className="text-[10px] font-black transition-all hover:scale-105 cursor-default" style={{ color }}>{value}</span>
  </div>
);
