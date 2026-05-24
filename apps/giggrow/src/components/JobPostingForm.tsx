import React, { useState } from 'react';
import { Briefcase, MapPin, DollarSign, Tag, AlertCircle, Loader2 } from 'lucide-react';
import { apiFetch } from '../lib/api';

export const JobPostingForm: React.FC = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    budgetMin: '',
    budgetMax: '',
    locationLat: '',
    locationLng: '',
    category: ''
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    
    const min = Number(formData.budgetMin);
    const max = Number(formData.budgetMax);
    
    if (!formData.budgetMin || isNaN(min) || min <= 0) {
      newErrors.budgetMin = 'Valid minimum budget is required';
    }
    if (!formData.budgetMax || isNaN(max) || max <= 0) {
      newErrors.budgetMax = 'Valid maximum budget is required';
    }
    if (min && max && min > max) {
      newErrors.budgetMax = 'Maximum budget must be greater than minimum';
    }

    const lat = Number(formData.locationLat);
    const lng = Number(formData.locationLng);
    
    if (!formData.locationLat || isNaN(lat) || lat < -90 || lat > 90) {
      newErrors.locationLat = 'Valid latitude (-90 to 90) is required';
    }
    if (!formData.locationLng || isNaN(lng) || lng < -180 || lng > 180) {
      newErrors.locationLng = 'Valid longitude (-180 to 180) is required';
    }
    
    if (!formData.category.trim()) newErrors.category = 'Category is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    setIsSubmitting(true);
    setErrors({});
    
    try {
      await apiFetch('/api/jobs', {
        method: 'POST',
        body: JSON.stringify({
          ...formData,
          budgetMin: Number(formData.budgetMin),
          budgetMax: Number(formData.budgetMax),
          locationLat: Number(formData.locationLat),
          locationLng: Number(formData.locationLng)
        })
      });
      
      setSuccess(true);
      setFormData({
        title: '',
        description: '',
        budgetMin: '',
        budgetMax: '',
        locationLat: '',
        locationLng: '',
        category: ''
      });
      
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setErrors({ submit: err.message || 'Failed to post job' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error for this field when user types
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-[#0a0a1f]/60 p-6 backdrop-blur-xl md:p-8">
      <div className="mb-6 flex items-center gap-3 text-[#00f0ff]">
        <Briefcase className="h-5 w-5" />
        <h2 className="text-[12px] font-black uppercase tracking-[0.4em]">POST A NEW JOB</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">JOB TITLE</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className={`w-full rounded-sm border ${errors.title ? 'border-[#ff00ff]' : 'border-white/10'} bg-black/40 p-3 text-sm text-white focus:border-[#00f0ff] focus:outline-none`}
            placeholder="e.g. Commercial HVAC Installation"
          />
          {errors.title && <p className="text-[10px] text-[#ff00ff]">{errors.title}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">DESCRIPTION</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className={`w-full h-32 rounded-sm border ${errors.description ? 'border-[#ff00ff]' : 'border-white/10'} bg-black/40 p-3 text-sm text-white focus:border-[#00f0ff] focus:outline-none resize-none`}
            placeholder="Detailed description of the work required..."
          />
          {errors.description && <p className="text-[10px] text-[#ff00ff]">{errors.description}</p>}
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 flex items-center gap-2">
              <DollarSign className="h-3 w-3" /> MIN BUDGET
            </label>
            <input
              type="number"
              name="budgetMin"
              value={formData.budgetMin}
              onChange={handleChange}
              className={`w-full rounded-sm border ${errors.budgetMin ? 'border-[#ff00ff]' : 'border-white/10'} bg-black/40 p-3 text-sm text-white focus:border-[#00f0ff] focus:outline-none`}
              placeholder="e.g. 500"
            />
            {errors.budgetMin && <p className="text-[10px] text-[#ff00ff]">{errors.budgetMin}</p>}
          </div>
          
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 flex items-center gap-2">
              <DollarSign className="h-3 w-3" /> MAX BUDGET
            </label>
            <input
              type="number"
              name="budgetMax"
              value={formData.budgetMax}
              onChange={handleChange}
              className={`w-full rounded-sm border ${errors.budgetMax ? 'border-[#ff00ff]' : 'border-white/10'} bg-black/40 p-3 text-sm text-white focus:border-[#00f0ff] focus:outline-none`}
              placeholder="e.g. 1500"
            />
            {errors.budgetMax && <p className="text-[10px] text-[#ff00ff]">{errors.budgetMax}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 flex items-center gap-2">
              <MapPin className="h-3 w-3" /> LATITUDE
            </label>
            <input
              type="number"
              step="any"
              name="locationLat"
              value={formData.locationLat}
              onChange={handleChange}
              className={`w-full rounded-sm border ${errors.locationLat ? 'border-[#ff00ff]' : 'border-white/10'} bg-black/40 p-3 text-sm text-white focus:border-[#00f0ff] focus:outline-none`}
              placeholder="e.g. 34.0522"
            />
            {errors.locationLat && <p className="text-[10px] text-[#ff00ff]">{errors.locationLat}</p>}
          </div>
          
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 flex items-center gap-2">
              <MapPin className="h-3 w-3" /> LONGITUDE
            </label>
            <input
              type="number"
              step="any"
              name="locationLng"
              value={formData.locationLng}
              onChange={handleChange}
              className={`w-full rounded-sm border ${errors.locationLng ? 'border-[#ff00ff]' : 'border-white/10'} bg-black/40 p-3 text-sm text-white focus:border-[#00f0ff] focus:outline-none`}
              placeholder="e.g. -118.2437"
            />
            {errors.locationLng && <p className="text-[10px] text-[#ff00ff]">{errors.locationLng}</p>}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 flex items-center gap-2">
            <Tag className="h-3 w-3" /> CATEGORY
          </label>
          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className={`w-full rounded-sm border ${errors.category ? 'border-[#ff00ff]' : 'border-white/10'} bg-black/40 p-3 text-sm text-white focus:border-[#00f0ff] focus:outline-none`}
            placeholder="e.g. HVAC, Plumbing, Electrical"
          />
          {errors.category && <p className="text-[10px] text-[#ff00ff]">{errors.category}</p>}
        </div>

        {errors.submit && (
          <div className="flex items-center gap-3 rounded-sm border border-[#ff00ff]/30 bg-[#ff00ff]/5 p-4 text-[#ff00ff]">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span className="text-[10px] font-bold uppercase tracking-[0.1em]">{errors.submit}</span>
          </div>
        )}

        {success && (
          <div className="flex items-center gap-3 rounded-sm border border-[#00f0ff]/30 bg-[#00f0ff]/5 p-4 text-[#00f0ff]">
            <span className="text-[10px] font-bold uppercase tracking-[0.1em]">JOB POSTED SUCCESSFULLY</span>
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-md border border-[#00f0ff]/50 bg-gradient-to-r from-[#00f0ff] to-[#00b0ff] px-8 py-4 text-[11px] font-black uppercase tracking-[0.35em] text-[#0a0a1f] shadow-[0_0_40px_rgba(0,240,255,0.4)] transition hover:scale-[1.02] hover:shadow-[0_0_55px_rgba(0,255,255,0.55)] disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              POSTING...
            </>
          ) : (
            'POST JOB'
          )}
        </button>
      </form>
    </div>
  );
};
