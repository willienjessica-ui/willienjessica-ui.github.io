import React, { useState, useEffect } from 'react';
import { apiFetch } from '../lib/api';
import { Loader2, Zap, AlertCircle } from 'lucide-react';

interface Match {
  jobId: string;
  score: number;
  reasoning: string;
}

export const JobMatching: React.FC = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMatches();
  }, []);

  const fetchMatches = async () => {
    try {
      const data = await apiFetch('/api/matching');
      setMatches(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch job matches');
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
          <Zap className="h-5 w-5" />
          <h2 className="text-[12px] font-black uppercase tracking-[0.4em]">AI OPPORTUNITY MATCHES</h2>
        </div>
      </div>

      {matches.length === 0 ? (
        <div className="flex h-32 flex-col items-center justify-center text-white/40">
          <Zap className="mb-2 h-8 w-8 opacity-20" />
          <p className="text-xs uppercase tracking-widest">No relevant opportunity matches found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {matches.map((match) => (
            <div key={match.jobId} className="flex flex-col gap-2 rounded-xl border border-white/10 bg-black/40 p-5 transition hover:border-white/20">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-black uppercase tracking-tight text-white">Opportunity ID: {match.jobId}</h3>
                <div className="text-lg font-black text-[#00f0ff]">{match.score}% Match</div>
              </div>
              <p className="text-xs text-white/60">{match.reasoning}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
