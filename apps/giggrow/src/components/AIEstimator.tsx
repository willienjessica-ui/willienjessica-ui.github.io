import React, { useState } from 'react';
import { Cpu, Loader2, Zap, AlertCircle, CheckCircle2, FileText, Camera } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { apiFetch } from '../lib/api';

interface EstimateResult {
  estimatedMin: number;
  estimatedMax: number;
  suggestedMaterials: string[];
  laborHoursEstimate: number;
  confidenceScore: number;
  reasoning: string;
  forensicReport: {
    materialsIdentified: string[];
    aestheticGrade: string;
    strategicInsights: string[];
    brandSentiment: string;
  };
}

export const AIEstimator: React.FC = () => {
  const [description, setDescription] = useState('');
  const [isEstimating, setIsEstimating] = useState(false);
  const [result, setResult] = useState<EstimateResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleEstimate = async () => {
    if (!description) {
      setError('Please provide a job description for analysis.');
      return;
    }

    setIsEstimating(true);
    setError(null);
    setResult(null);

    try {
      const data = await apiFetch('/api/ai/estimate', {
        method: 'POST',
        body: JSON.stringify({ jobDescription: description })
      });

      setResult(data);
    } catch (err: any) {
      console.error('AI Estimation failed:', err);
      setError(err.message);
    } finally {
      setIsEstimating(false);
    }
  };

  return (
    <div className="rounded-2xl border border-[#00f0ff]/20 bg-[#050913]/60 p-6 backdrop-blur-3xl md:p-8">
      <div className="mb-6 flex items-center gap-3 text-[#00f0ff]">
        <Cpu className="h-5 w-5" />
        <h2 className="text-[12px] font-black uppercase tracking-[0.4em]">AI STRATEGIC HANDSHAKE ESTIMATOR</h2>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">OPPORTUNITY PARAMETERS // HANDSHAKE PROTOCOL</label>
          <textarea 
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full h-32 rounded-sm border border-white/10 bg-black/40 p-4 text-sm text-white focus:border-[#00f0ff] focus:outline-none transition-colors resize-none"
            placeholder="Describe the engagement in detail for AI handshake analysis..."
          />
        </div>

        <button
          onClick={handleEstimate}
          disabled={isEstimating}
          className="usa-button w-full py-4 text-[10px] font-black uppercase tracking-[0.3em] flex items-center justify-center gap-3 disabled:opacity-50"
        >
          {isEstimating ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              ANALYZING INFRASTRUCTURE...
            </>
          ) : (
            <>
              <Zap className="h-4 w-4" />
              GENERATE HANDSHAKE BID
            </>
          )}
        </button>

        {error && (
          <div className="flex items-center gap-3 rounded-sm border border-[#ff00ff]/30 bg-[#ff00ff]/5 p-4 text-[#ff00ff]">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span className="text-[10px] font-bold uppercase tracking-[0.1em]">{error}</span>
          </div>
        )}

        <AnimatePresence>
          {result && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 space-y-6 border-t border-white/10 pt-8"
            >
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-1">
                  <div className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">ESTIMATED RANGE</div>
                  <div className="text-3xl font-black text-[#00f0ff]">
                    ${result.estimatedMin.toLocaleString()} - ${result.estimatedMax.toLocaleString()}
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">LABOR ESTIMATE</div>
                  <div className="text-3xl font-black text-white">
                    {result.laborHoursEstimate} HOURS
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-white/40">
                    <FileText className="h-3 w-3" />
                    SUGGESTED MATERIALS
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {result.suggestedMaterials.map((m, i) => (
                      <span key={i} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-bold text-white/80 uppercase">
                        {m}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-white/40">
                    <CheckCircle2 className="h-3 w-3" />
                    CONFIDENCE SCORE
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
                    <div 
                      className="h-full bg-[#00f0ff] shadow-[0_0_10px_#00f0ff]" 
                      style={{ width: `${result.confidenceScore * 100}%` }}
                    />
                  </div>
                  <div className="text-right text-[10px] font-black text-[#00f0ff]">
                    {(result.confidenceScore * 100).toFixed(0)}%
                  </div>
                </div>
              </div>

              <div className="rounded-sm border border-[#00f0ff]/20 bg-[#00f0ff]/5 p-6">
                <div className="mb-4 flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.4em] text-[#00f0ff]">
                  <Zap className="h-4 w-4" />
                  FORENSIC REVEAL REPORT
                </div>
                <div className="space-y-4">
                  <div>
                    <div className="text-[9px] font-black uppercase tracking-[0.2em] text-white/40">STRATEGIC INSIGHTS</div>
                    <ul className="mt-2 space-y-1">
                      {result.forensicReport.strategicInsights.map((insight, i) => (
                        <li key={i} className="text-xs text-white/70 flex items-start gap-2">
                          <span className="text-[#00f0ff] mt-1">▸</span>
                          {insight}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-[9px] font-black uppercase tracking-[0.2em] text-white/40">AESTHETIC GRADE</div>
                      <div className="mt-1 text-sm font-black text-white uppercase">{result.forensicReport.aestheticGrade}</div>
                    </div>
                    <div>
                      <div className="text-[9px] font-black uppercase tracking-[0.2em] text-white/40">BRAND SENTIMENT</div>
                      <div className="mt-1 text-sm font-black text-white uppercase">{result.forensicReport.brandSentiment}</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">SYSTEM REASONING</div>
                <p className="text-xs leading-relaxed text-white/60 italic">
                  "{result.reasoning}"
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
