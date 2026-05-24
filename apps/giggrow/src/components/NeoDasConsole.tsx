import React, { useState, useEffect } from 'react';
import { Terminal, Cpu, Shield, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const NeoDasConsole: React.FC = () => {
  const [logs, setLogs] = useState<string[]>([]);
  const [bootStep, setBootStep] = useState(0);

  const bootSequence = [
    "INITIALIZING NEODAS KERNEL V3.0.0...",
    "UEFI SERVICES: OK",
    "BOOTLOADER: /NeoDas_Core/bootloader/src/main.rs LOADED",
    "KERNEL: /NeoDas_Core/kernel/src/lib.rs LOADED",
    "SCRIPTS: /NeoDas_Core/scripts/build_throne.sh READY",
    "-------------------------------",
    "INITIALIZING INTELLIGENCE LAYER...",
    "LUMOS: /NeoDas_Core/lumos/orchestrator.py ACTIVE",
    "WEB_LUMOS: /NeoDas_Core/web_lumos/bridge.py ACTIVE",
    "CHAT: /NeoDas_Core/chat/command_bridge.py SECURE",
    "MONITOR: /NeoDas_Core/services/debbie_monitor.py DAEMON",
    "LEDGER: /NeoDas_Core/gig_tracker.py READY",
    "-------------------------------",
    "STATUS: SOVEREIGN CORE ACTIVE",
    "OWNER: WILLIE MORRIS",
    "COMPANY: MORRISSOFT",
    "TARGET: $50,000 THRONE",
    "-------------------------------",
    "REVENUE LOGIC: 100% BLACK INK",
    "MARKET: AMERICAN LUXURY",
    "-------------------------------",
    "MISSION STATUS: READY"
  ];

  useEffect(() => {
    if (bootStep < bootSequence.length) {
      const timer = setTimeout(() => {
        setLogs(prev => [...prev, bootSequence[bootStep]]);
        setBootStep(prev => prev + 1);
      }, 150 + Math.random() * 300);
      return () => clearTimeout(timer);
    }
  }, [bootStep]);

  return (
    <div className="flex h-full flex-col bg-black font-mono text-[10px] leading-relaxed text-[#00f0ff]">
      <div className="flex items-center gap-2 border-b border-[#00f0ff]/20 bg-[#00f0ff]/5 px-3 py-2">
        <Terminal className="h-3 w-3" />
        <span className="font-black uppercase tracking-[0.2em]">NEODAS KERNEL CONSOLE</span>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-1 scrollbar-hide">
        <AnimatePresence initial={false}>
          {logs.map((log, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className={`${log.includes('STATUS') || log.includes('OWNER') ? 'text-white font-bold' : ''}`}
            >
              <span className="mr-2 opacity-30">[{new Date().toLocaleTimeString([], { hour12: false })}]</span>
              {log}
            </motion.div>
          ))}
        </AnimatePresence>
        
        {bootStep >= bootSequence.length && (
          <motion.div
            animate={{ opacity: [0.2, 1, 0.2] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="h-3 w-1.5 bg-[#00f0ff] inline-block ml-1"
          />
        )}
      </div>

      <div className="grid grid-cols-3 border-t border-[#00f0ff]/20 bg-[#00f0ff]/5 p-2">
        <div className="flex items-center gap-2 px-2">
          <Cpu className="h-3 w-3 opacity-50" />
          <span className="text-[8px] uppercase tracking-tighter opacity-70">CPU: 0.4%</span>
        </div>
        <div className="flex items-center gap-2 px-2 border-x border-[#00f0ff]/10">
          <Shield className="h-3 w-3 opacity-50" />
          <span className="text-[8px] uppercase tracking-tighter opacity-70">SEC: SOVEREIGN</span>
        </div>
        <div className="flex items-center gap-2 px-2">
          <Zap className="h-3 w-3 opacity-50" />
          <span className="text-[8px] uppercase tracking-tighter opacity-70">PWR: OPTIMIZED</span>
        </div>
      </div>
    </div>
  );
};
