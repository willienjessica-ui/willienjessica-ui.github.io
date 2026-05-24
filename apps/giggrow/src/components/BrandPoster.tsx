import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { X, Loader2, Download, Image as ImageIcon, ShieldAlert } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

declare global {
  interface Window {
    aistudio: {
      hasSelectedApiKey: () => Promise<boolean>;
      openSelectKey: () => Promise<void>;
    };
  }
}

interface BrandPosterProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BrandPoster: React.FC<BrandPosterProps> = ({ isOpen, onClose }) => {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [needsKey, setNeedsKey] = useState(false);

  const checkKey = async () => {
    if (typeof window.aistudio !== 'undefined') {
      const hasKey = await window.aistudio.hasSelectedApiKey();
      if (!hasKey) {
        setNeedsKey(true);
        return false;
      }
      return true;
    }
    return true; // Fallback for environments without the helper
  };

  const handleOpenKeyDialog = async () => {
    if (typeof window.aistudio !== 'undefined') {
      await window.aistudio.openSelectKey();
      setNeedsKey(false);
      // Proceed to generate after key selection
      generatePoster();
    }
  };

  const generatePoster = async () => {
    setLoading(true);
    setError(null);

    const hasKey = await checkKey();
    if (!hasKey) {
      setLoading(false);
      return;
    }

    try {
      // Create a new instance right before making the call to ensure it uses the latest key
      const apiKey = (typeof process !== 'undefined' && process.env) ? (process.env as any).API_KEY : '';
      const ai = new GoogleGenAI({ apiKey });
      
      const prompt = `Create a bold, cinematic, premium brand poster for GIGGROW. 
Style: Hyper-detailed, cinematic, premium poster art, polished commercial quality, electric blue lightning, dark black background, dramatic contrast, patriotic energy, sovereign American marketplace branding, slightly stylized but high-quality and intentional.
Composition: 
- Large glowing neon blue title text: GIGGROW.
- Massive electric blue lightning bolts striking behind the logo, pulsing like the heart of America.
- A HUGE WAVING AMERICAN FLAG made of glowing NEON BLUE, CYAN, and WHITE tubes, dominating the entire background. The flag is large, dramatic, flowing, and clearly visible across the full composition, with electricity flowing through its neon stripes.
- A sexy, confident, attractive blonde barmaid / tavern girl at the top right holding a frosty amber beer mug with thick foam. She looks iconic, bold, playful, flirty, and strong — like a signature mascot for the brand.
- Below the logo, a strong lineup of proud, capable American service providers: a construction specialist in an orange hard hat, a female operations lead at a laptop, a field coordinator, and a mechanic/field tech holding a large silver wrench.
Brand Feel: Rebellious, blue-collar, electric, patriotic, hard-working, high-energy. Iconic American provider-network poster mixed with tavern/beer-hall brand attitude. Strong masculine/feminine energy, patriotic swagger, blue-collar pride.
Color Palette: Deep navy black background (#0a0a1f), electric blue lightning and glow (#00ffff), bright neon blue GIGGROW logo (#00f0ff), neon blue and white flag stripes. Crisp, not muddy.
Quality: 4K poster quality, ultra sharp, highly detailed faces, high contrast, premium ad art, production-grade branding image.
Negative Constraints: Do NOT make it childish, goofy, fantasy medieval, or an Oktoberfest cartoon. Do NOT make the flag subtle or tiny. NO RED ANYWHERE EXCEPT THE ORANGE HARD HATS. NO PINK TINTS. NO ROSE COLORS.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.1-flash-image-preview',
        contents: {
          parts: [{ text: prompt }],
        },
        config: {
          imageConfig: {
            aspectRatio: "3:4",
            imageSize: "1K"
          },
        },
      });

      let foundImage = false;
      for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
          const base64Data = part.inlineData.data;
          setImage(`data:image/png;base64,${base64Data}`);
          foundImage = true;
          break;
        }
      }

      if (!foundImage) {
        throw new Error("No image was generated in the response.");
      }
    } catch (err: any) {
      console.error("Poster generation error:", err);
      if (err.message?.includes("entity was not found")) {
        setNeedsKey(true);
        setError("API Key session expired. Please select your key again.");
      } else if (err.message?.toLowerCase().includes("quota") || err.message?.toLowerCase().includes("limit")) {
        setError("API Quota Exceeded. Please select a different API key or check your Google Cloud billing.");
      } else {
        setError(err.message || "Failed to generate brand poster. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && !image && !loading) {
      generatePoster();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/90 backdrop-blur-md"
        />
        
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="command-panel relative max-h-[90vh] w-full max-w-4xl overflow-hidden rounded-2xl border border-[#00f0ff]/30 shadow-[0_0_100px_rgba(0,240,255,0.2)]"
        >
          <div className="flex items-center justify-between border-b border-white/10 bg-black/40 px-6 py-4">
            <div className="flex items-center gap-3">
              <ImageIcon className="h-5 w-5 text-[#00f0ff]" />
              <span className="text-[11px] font-black uppercase tracking-[0.35em] text-white">
                Brand Asset // Cinematic Poster
              </span>
            </div>
            <button 
              onClick={onClose}
              className="rounded-full p-2 text-white/50 hover:bg-white/10 hover:text-white transition"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="relative flex min-h-[400px] items-center justify-center bg-[#0a0a1f] p-6">
            {loading && (
              <div className="flex flex-col items-center gap-4 text-center">
                <Loader2 className="h-12 w-12 animate-spin text-[#00f0ff]" />
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/60">
                  Synthesizing High-Resolution Brand Assets...
                </p>
              </div>
            )}

            {needsKey && !loading && (
              <div className="flex max-w-md flex-col items-center gap-6 text-center">
                <ShieldAlert className="h-16 w-16 text-[#00f0ff]" />
                <div className="space-y-2">
                  <h3 className="text-lg font-black uppercase tracking-tight text-white">API Key Required</h3>
                  <p className="text-sm text-white/60">
                    To generate high-quality cinematic posters using the Gemini 3.1 Image model, you must select a paid API key from your Google Cloud project.
                  </p>
                  <p className="text-xs text-white/40 italic">
                    Refer to <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noopener noreferrer" className="text-[#00f0ff] underline">billing documentation</a> for details.
                  </p>
                </div>
                <button
                  onClick={handleOpenKeyDialog}
                  className="rounded-md bg-[#00f0ff] px-8 py-3 text-[11px] font-black uppercase tracking-[0.2em] text-[#0a0a1f] shadow-[0_0_30px_rgba(0,240,255,0.4)] transition hover:scale-105"
                >
                  Select API Key
                </button>
              </div>
            )}

            {error && !needsKey && !loading && (
              <div className="flex flex-col items-center gap-4 text-center">
                <p className="text-sm font-bold text-[#00f0ff]">{error}</p>
                <button
                  onClick={generatePoster}
                  className="text-[10px] font-black uppercase tracking-[0.2em] text-[#00f0ff] underline"
                >
                  Retry Generation
                </button>
              </div>
            )}

            {image && !loading && (
              <div className="relative group">
                <img 
                  src={image} 
                  alt="GigGrow Brand Poster" 
                  className="max-h-[70vh] rounded-lg border border-white/10 shadow-2xl"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-[2px] rounded-lg">
                  <a 
                    href={image} 
                    download="GigGrow_Brand_Poster.png"
                    className="flex items-center gap-2 rounded-full bg-white px-6 py-3 text-[11px] font-black uppercase tracking-[0.2em] text-black transition hover:scale-110"
                  >
                    <Download className="h-4 w-4" />
                    Download 4K Poster
                  </a>
                </div>
              </div>
            )}
          </div>

          <div className="border-t border-white/10 bg-black/40 px-6 py-4">
            <p className="text-[9px] font-medium uppercase tracking-[0.2em] text-white/40">
              © 2026 GIGGROW PROTOCOL // ALL ASSETS GENERATED VIA GEMINI 3.1 FLASH IMAGE PREVIEW
            </p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
