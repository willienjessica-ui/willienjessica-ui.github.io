import React, { useEffect, useRef, useState } from 'react';
import { setOptions, importLibrary } from '@googlemaps/js-api-loader';
import socket from '../lib/socket';
import { MapPin, Zap, Users, Shield, Navigation } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

import { CommunicationBridge } from './CommunicationBridge';

interface Operator {
  id: string;
  name: string;
  role: string;
  location: { lat: number; lng: number };
}

interface JobSignal {
  id: string;
  title: string;
  location: { lat: number; lng: number };
  status: 'pending' | 'negotiating' | 'active';
  price?: number;
}

export const DispatchMap: React.FC = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [operators, setOperators] = useState<Record<string, Operator>>({});
  const [jobs, setJobs] = useState<Record<string, JobSignal>>({});
  const [activeSignal, setActiveSignal] = useState<JobSignal | null>(null);
  const [isOnline, setIsOnline] = useState(false);
  const [activeCall, setActiveCall] = useState<{ name: string; role: string; id: string } | null>(null);
  const markersRef = useRef<Record<string, google.maps.Marker>>({});

  const [mapError, setMapError] = useState(false);

  useEffect(() => {
    setOptions({
      key: (import.meta as any).env.VITE_GOOGLE_MAPS_API_KEY || '',
    });

    Promise.all([
      importLibrary('maps'),
      importLibrary('marker')
    ]).then(([{ Map }]) => {
      if (mapRef.current) {
        const newMap = new Map(mapRef.current, {
          center: { lat: 37.7749, lng: -122.4194 }, // SF Default
          zoom: 13,
          styles: [
            { elementType: "geometry", stylers: [{ color: "#0a0a1f" }] },
            { elementType: "labels.text.stroke", stylers: [{ color: "#0a0a1f" }] },
            { elementType: "labels.text.fill", stylers: [{ color: "#00f0ff" }] },
            { featureType: "administrative", elementType: "geometry", stylers: [{ color: "#1a1a2f" }] },
            { featureType: "water", elementType: "geometry", stylers: [{ color: "#001a33" }] },
            { featureType: "road", elementType: "geometry", stylers: [{ color: "#1a1a2f" }] },
            { featureType: "road", elementType: "geometry.stroke", stylers: [{ color: "#00f0ff", opacity: 0.2 }] },
            { featureType: "transit", elementType: "geometry", stylers: [{ color: "#1a1a2f" }] },
          ],
          disableDefaultUI: true,
        });
        setMap(newMap);
      }
    }).catch((e: any) => {
      console.error("Map load failed", e);
      setMapError(true);
    });

    // Socket Listeners
    socket.on('operator:updated', (data: Operator) => {
      setOperators(prev => ({ ...prev, [data.id]: data }));
    });

    socket.on('operator:offline', ({ id }) => {
      setOperators(prev => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
      if (markersRef.current[id]) {
        markersRef.current[id].setMap(null);
        delete markersRef.current[id];
      }
    });

    socket.on('job:broadcast', (job: JobSignal) => {
      setJobs(prev => ({ ...prev, [job.id]: job }));
      setActiveSignal(job);
      
      // Auto-clear signal after 10s if not accepted
      setTimeout(() => {
        setActiveSignal(prev => prev?.id === job.id ? null : prev);
      }, 10000);
    });

    return () => {
      socket.off('operator:updated');
      socket.off('operator:offline');
      socket.off('job:broadcast');
    };
  }, []);

  // Update Markers
  useEffect(() => {
    if (!map) return;

    // Operator Markers
    (Object.values(operators) as Operator[]).forEach(op => {
      if (!markersRef.current[op.id]) {
        markersRef.current[op.id] = new google.maps.Marker({
          position: op.location,
          map,
          title: op.name,
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 8,
            fillColor: "#00f0ff",
            fillOpacity: 1,
            strokeColor: "#ffffff",
            strokeWeight: 2,
          },
        });
      } else {
        markersRef.current[op.id].setPosition(op.location);
      }
    });

    // Job Markers
    (Object.values(jobs) as JobSignal[]).forEach(job => {
      const markerId = `job-${job.id}`;
      if (!markersRef.current[markerId]) {
        markersRef.current[markerId] = new google.maps.Marker({
          position: job.location,
          map,
          title: job.title,
          icon: {
            path: google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
            scale: 6,
            fillColor: "#ff00ff",
            fillOpacity: 1,
            strokeColor: "#ffffff",
            strokeWeight: 2,
          },
        });
      }
    });
  }, [operators, jobs, map]);

  const toggleOnline = () => {
    const newStatus = !isOnline;
    setIsOnline(newStatus);
    if (newStatus) {
      // Simulate location for demo
      const location = { lat: 37.7749 + (Math.random() - 0.5) * 0.02, lng: -122.4194 + (Math.random() - 0.5) * 0.02 };
      socket.emit('operator:online', {
        name: "Elite Provider",
        role: "Systems Tech",
        location
      });
      map?.panTo(location);
    } else {
      socket.emit('operator:offline', { id: socket.id });
    }
  };

  const broadcastOpportunity = () => {
    const location = { lat: 37.7749 + (Math.random() - 0.5) * 0.05, lng: -122.4194 + (Math.random() - 0.5) * 0.05 };
    socket.emit('job:signal', {
      title: "EMERGENCY INFRASTRUCTURE REPAIR",
      location,
      status: 'pending'
    });
  };

  return (
    <div className="relative h-full w-full overflow-hidden rounded-sm border border-[#00f0ff]/30 bg-[#0a0a1f] shadow-[0_0_50px_rgba(0,240,255,0.1)]">
      {mapError ? (
        <div className="flex h-full w-full flex-col items-center justify-center bg-[#0a0a1f] p-6 text-center">
          <MapPin className="mb-4 h-12 w-12 text-white/20" />
          <h3 className="mb-2 text-lg font-black uppercase tracking-widest text-white/40">Map Unavailable</h3>
          <p className="text-xs text-white/30 max-w-sm">
            The opportunity map requires a valid Google Maps API key. Please configure your environment variables.
          </p>
        </div>
      ) : (
        <div ref={mapRef} className="h-full w-full" />
      )}
      
      {/* Overlay Controls */}
      <div className="absolute top-6 left-6 flex flex-col gap-3">
        <div className="flex items-center gap-3 rounded-sm border border-[#00f0ff]/30 bg-[#0a0a1f]/80 p-3 backdrop-blur-md">
          <div className={`h-2 w-2 rounded-full ${isOnline ? 'bg-[#00f0ff] animate-pulse shadow-[0_0_10px_#00f0ff]' : 'bg-white/20'}`} />
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white">
            {isOnline ? 'PROVIDER ONLINE' : 'PROVIDER STANDBY'}
          </span>
        </div>
        
        <button 
          onClick={toggleOnline}
          className={`usa-button px-6 py-3 text-[9px] font-black uppercase tracking-[0.2em] transition-all ${isOnline ? 'opacity-50 grayscale' : ''}`}
        >
          {isOnline ? 'GO OFFLINE' : 'GO ONLINE'}
        </button>
      </div>

      <div className="absolute top-6 right-6 flex flex-col gap-3">
        <button 
          onClick={broadcastOpportunity}
          className="usa-button border-[#ff00ff]/50 bg-[#ff00ff]/10 px-6 py-3 text-[9px] font-black uppercase tracking-[0.2em] text-[#ff00ff] hover:bg-[#ff00ff]/20 shadow-[0_0_20px_rgba(255,0,255,0.2)]"
        >
          <Zap className="mr-2 h-3 w-3 inline" />
          BROADCAST OPPORTUNITY
        </button>
      </div>

      {/* Signal Received Overlay */}
      <AnimatePresence>
        {activeSignal && (
          <motion.div 
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="absolute bottom-6 left-1/2 -translate-x-1/2 w-full max-w-md"
          >
            <div className="mx-4 rounded-sm border-2 border-[#00f0ff] bg-[#0a0a1f] p-6 shadow-[0_0_50px_rgba(0,240,255,0.4)]">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-[#00f0ff]">
                    <Zap className="h-4 w-4 animate-bounce" />
                    <span className="text-[10px] font-black uppercase tracking-[0.3em]">OPPORTUNITY RECEIVED</span>
                  </div>
                  <h3 className="text-lg font-black uppercase tracking-tight text-white">{activeSignal.title}</h3>
                  <p className="text-[10px] uppercase tracking-[0.1em] text-white/40 italic">LOCATION: SF SECTOR 7 // PRIORITY ALPHA</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-black text-[#00f0ff]">$450.00</div>
                  <div className="text-[9px] uppercase tracking-[0.1em] text-white/40">EST. VALUE</div>
                </div>
              </div>
              
              <div className="mt-6 grid grid-cols-2 gap-3">
                <button 
                  onClick={() => setActiveSignal(null)}
                  className="rounded-sm border border-white/10 bg-white/5 py-3 text-[10px] font-black uppercase tracking-[0.2em] text-white/60 hover:bg-white/10 transition"
                >
                  DECLINE
                </button>
                <button 
                  onClick={() => {
                    setActiveCall({
                      name: "Alpha Client",
                      role: "Logistics Lead",
                      id: activeSignal.id
                    });
                    setActiveSignal(null);
                  }}
                  className="usa-button py-3 text-[10px] font-black uppercase tracking-[0.2em]"
                >
                  ACCEPT & NEGOTIATE
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {activeCall && (
          <CommunicationBridge 
            participantName={activeCall.name}
            participantRole={activeCall.role}
            opportunityId={activeCall.id}
            onClose={() => setActiveCall(null)}
          />
        )}
      </AnimatePresence>

      {/* Map Stats */}
      <div className="absolute bottom-6 left-6 flex gap-4">
        <div className="flex items-center gap-3 rounded-sm border border-white/10 bg-[#0a0a1f]/80 p-3 backdrop-blur-md">
          <Users className="h-4 w-4 text-[#00f0ff]" />
          <div className="flex flex-col">
            <span className="text-[14px] font-black text-white">{Object.keys(operators).length}</span>
            <span className="text-[8px] font-bold uppercase tracking-[0.1em] text-white/40">OPERATORS</span>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-sm border border-white/10 bg-[#0a0a1f]/80 p-3 backdrop-blur-md">
          <Navigation className="h-4 w-4 text-[#ff00ff]" />
          <div className="flex flex-col">
            <span className="text-[14px] font-black text-white">{Object.keys(jobs).length}</span>
            <span className="text-[8px] font-bold uppercase tracking-[0.1em] text-white/40">SIGNALS</span>
          </div>
        </div>
      </div>
    </div>
  );
};
