import React, { useState, useEffect } from 'react';
import { Users, DollarSign, FileText, CheckCircle2, XCircle, MessageSquare, Loader2, AlertCircle } from 'lucide-react';
import { apiFetch } from '../lib/api';

interface Application {
  id: string;
  providerId: string;
  bidAmount: number;
  proposalSummary: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'NEGOTIATING';
  provider: {
    user: {
      email: string;
    };
    businessName: string;
  };
}

interface JobApplicationsProps {
  jobId: string;
}

export const JobApplications: React.FC<JobApplicationsProps> = ({ jobId }) => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchApplications();
  }, [jobId]);

  const fetchApplications = async () => {
    try {
      const data = await apiFetch(`/api/jobs/${jobId}/applications`);
      setApplications(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch applications');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAction = async (applicationId: string, action: 'ACCEPT' | 'REJECT' | 'NEGOTIATE') => {
    setActionLoading(applicationId);
    try {
      await apiFetch(`/api/jobs/applications/${applicationId}/${action.toLowerCase()}`, {
        method: 'POST'
      });
      await fetchApplications(); // Refresh list
    } catch (err: any) {
      setError(err.message || `Failed to ${action.toLowerCase()} application`);
    } finally {
      setActionLoading(null);
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
          <Users className="h-5 w-5" />
          <h2 className="text-[12px] font-black uppercase tracking-[0.4em]">JOB APPLICATIONS</h2>
        </div>
        <div className="rounded-full border border-[#00f0ff]/30 bg-[#00f0ff]/10 px-4 py-1">
          <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[#00f0ff]">
            {applications.length} TOTAL
          </span>
        </div>
      </div>

      {applications.length === 0 ? (
        <div className="flex h-32 flex-col items-center justify-center text-white/40">
          <Users className="mb-2 h-8 w-8 opacity-20" />
          <p className="text-xs uppercase tracking-widest">No applications yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map((app) => (
            <div key={app.id} className="rounded-xl border border-white/10 bg-black/40 p-5 transition hover:border-white/20">
              <div className="mb-4 flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h3 className="text-lg font-black uppercase tracking-tight text-white">
                    {app.provider.businessName || app.provider.user.email.split('@')[0]}
                  </h3>
                  <div className="mt-1 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#00f0ff]">
                    <DollarSign className="h-3 w-3" />
                    BID: ${app.bidAmount.toLocaleString()}
                  </div>
                </div>
                
                <div className={`rounded-full px-3 py-1 text-[9px] font-black uppercase tracking-[0.2em] ${
                  app.status === 'PENDING' ? 'bg-white/10 text-white' :
                  app.status === 'ACCEPTED' ? 'bg-[#00f0ff]/20 text-[#00f0ff]' :
                  app.status === 'REJECTED' ? 'bg-[#ff00ff]/20 text-[#ff00ff]' :
                  'bg-yellow-500/20 text-yellow-500'
                }`}>
                  {app.status}
                </div>
              </div>

              <div className="mb-6 space-y-2">
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-white/40">
                  <FileText className="h-3 w-3" />
                  PROPOSAL SUMMARY
                </div>
                <p className="text-sm leading-relaxed text-white/70">
                  {app.proposalSummary}
                </p>
              </div>

              {app.status === 'PENDING' && (
                <div className="flex flex-wrap gap-3 border-t border-white/10 pt-4">
                  <button
                    onClick={() => handleAction(app.id, 'ACCEPT')}
                    disabled={actionLoading === app.id}
                    className="flex flex-1 items-center justify-center gap-2 rounded-md border border-[#00f0ff]/50 bg-[#00f0ff]/10 px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-[#00f0ff] transition hover:bg-[#00f0ff]/20 disabled:opacity-50"
                  >
                    {actionLoading === app.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
                    ACCEPT
                  </button>
                  <button
                    onClick={() => handleAction(app.id, 'NEGOTIATE')}
                    disabled={actionLoading === app.id}
                    className="flex flex-1 items-center justify-center gap-2 rounded-md border border-white/20 bg-white/5 px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-white transition hover:bg-white/10 disabled:opacity-50"
                  >
                    {actionLoading === app.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <MessageSquare className="h-4 w-4" />}
                    NEGOTIATE
                  </button>
                  <button
                    onClick={() => handleAction(app.id, 'REJECT')}
                    disabled={actionLoading === app.id}
                    className="flex flex-1 items-center justify-center gap-2 rounded-md border border-[#ff00ff]/50 bg-[#ff00ff]/10 px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-[#ff00ff] transition hover:bg-[#ff00ff]/20 disabled:opacity-50"
                  >
                    {actionLoading === app.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <XCircle className="h-4 w-4" />}
                    REJECT
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
