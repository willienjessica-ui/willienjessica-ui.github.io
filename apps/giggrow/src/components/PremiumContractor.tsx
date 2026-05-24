import React, { useState } from 'react';
import { Shield, HardHat, AlertTriangle, FileText, CheckCircle, Bot } from 'lucide-react';
import { apiFetch } from '../lib/api';

interface NegotiationResult {
  recommendedBid: number;
  requiredPPE: string[];
  oshaRegulations: string[];
  contractTerms: string[];
  negotiationReasoning: string;
  complianceStatus: "COMPLIANT" | "HIGH_RISK" | "REQUIRES_CERTIFICATION";
}

export const PremiumContractor: React.FC = () => {
  const [jobDescription, setJobDescription] = useState('');
  const [bidAmount, setBidAmount] = useState<number | ''>('');
  const [providerNotes, setProviderNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<NegotiationResult | null>(null);
  const [error, setError] = useState('');

  const handleNegotiate = async () => {
    if (!jobDescription || !bidAmount) {
      setError('Job description and bid amount are required.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const data = await apiFetch('/api/ai/negotiate', {
        method: 'POST',
        body: JSON.stringify({ jobDescription, bidAmount: Number(bidAmount), providerNotes })
      });
      
      setResult(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="flex items-center space-x-4 bg-slate-900 text-white p-6 rounded-xl shadow-lg">
        <Shield className="w-12 h-12 text-yellow-400" />
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Premium Provider Mode</h1>
          <p className="text-slate-300">AI-Powered Contract Negotiation & OSHA Compliance</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-6 bg-white p-6 rounded-xl shadow border border-slate-200">
          <h2 className="text-xl font-semibold flex items-center">
            <FileText className="w-5 h-5 mr-2 text-blue-600" />
            Opportunity Details
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Opportunity Description</label>
              <textarea
                className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                rows={4}
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Describe the work to be done..."
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Your Initial Bid ($)</label>
              <input
                type="number"
                className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                value={bidAmount}
                onChange={(e) => setBidAmount(e.target.value ? Number(e.target.value) : '')}
                placeholder="e.g. 1500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Provider Notes (Optional)</label>
              <textarea
                className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                rows={2}
                value={providerNotes}
                onChange={(e) => setProviderNotes(e.target.value)}
                placeholder="Any specific conditions or materials you are providing..."
              />
            </div>

            {error && <div className="text-[#7dd3fc] text-sm p-3 bg-[#00D1FF]/10 border border-[#00D1FF]/20 rounded-lg">{error}</div>}

            <button
              onClick={handleNegotiate}
              disabled={loading}
              className="w-full py-3 px-4 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 disabled:opacity-50 flex items-center justify-center transition-colors"
            >
              {loading ? (
                <span className="animate-pulse">Analyzing Compliance & Terms...</span>
              ) : (
                <>
                  <Bot className="w-5 h-5 mr-2" />
                  Run AI Negotiation & Safety Check
                </>
              )}
            </button>
          </div>
        </div>

        <div className="space-y-6">
          {result ? (
            <div className="bg-white p-6 rounded-xl shadow border border-slate-200 space-y-6 animate-in fade-in slide-in-from-bottom-4">
              <div className="flex items-center justify-between border-b pb-4">
                <h2 className="text-xl font-semibold">AI Analysis Report</h2>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  result.complianceStatus === 'COMPLIANT' ? 'bg-green-100 text-green-800' :
                  result.complianceStatus === 'HIGH_RISK' ? 'bg-[#00D1FF]/10 text-[#00D1FF]' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {result.complianceStatus.replace('_', ' ')}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-lg border">
                  <p className="text-sm text-slate-500 font-medium">Your Bid</p>
                  <p className="text-2xl font-bold text-slate-900">${bidAmount}</p>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                  <p className="text-sm text-blue-600 font-medium">AI Recommended Bid</p>
                  <p className="text-2xl font-bold text-blue-900">${result.recommendedBid}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 flex items-center mb-2">
                    <HardHat className="w-4 h-4 mr-2 text-orange-500" />
                    Required PPE
                  </h3>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-slate-700">
                    {result.requiredPPE.map((ppe, i) => <li key={i}>{ppe}</li>)}
                  </ul>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-slate-900 flex items-center mb-2">
                    <AlertTriangle className="w-4 h-4 mr-2 text-yellow-500" />
                    OSHA Regulations
                  </h3>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-slate-700">
                    {result.oshaRegulations.map((reg, i) => <li key={i}>{reg}</li>)}
                  </ul>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-slate-900 flex items-center mb-2">
                    <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                    Suggested Contract Terms
                  </h3>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-slate-700">
                    {result.contractTerms.map((term, i) => <li key={i}>{term}</li>)}
                  </ul>
                </div>

                <div className="p-4 bg-slate-100 rounded-lg text-sm text-slate-800 italic">
                  "{result.negotiationReasoning}"
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 p-12 text-center border-2 border-dashed border-slate-200 rounded-xl">
              <Shield className="w-16 h-16 mb-4 text-slate-300" />
              <p>Enter opportunity details and your bid to receive an AI-powered compliance and negotiation report.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
