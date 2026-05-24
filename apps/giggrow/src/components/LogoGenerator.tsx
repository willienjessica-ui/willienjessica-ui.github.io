import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Sparkles, Loader2, Key } from 'lucide-react';

export const LogoGenerator: React.FC = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateLogo = async () => {
    setIsGenerating(true);
    setError(null);

    try {
      // Check if API key is selected
      if (!(await (window as any).aistudio.hasSelectedApiKey())) {
        await (window as any).aistudio.openSelectKey();
      }

      const apiKey = (typeof process !== 'undefined' && process.env) ? (process.env as any).API_KEY : '';
      const ai = new GoogleGenAI({ apiKey });
      
      const response = await ai.models.generateContent({
        model: 'gemini-3.1-flash-image-preview',
        contents: {
          parts: [
            {
              text: "A high-quality 4K professional logo for 'GIGGROW'. The text 'GIGGROW' is in a bold, italicized, electric blue font with a vibrant lightning glow. The background is a dark, dramatic black (#0a0a1f) with a HUGE WAVING AMERICAN FLAG made of glowing NEON BLUE, CYAN, and WHITE tubes. Powerful electric blue lightning bolts pulse through the flag like the heart of America. Below the text, a diverse group of heroic American service providers are shown: a construction specialist in an orange hard hat, a mechanic with a wrench, a female operations lead with a laptop, and a field coordinator. A blonde barmaid with a beer mug is visible at the top right. The style is cinematic, detailed, and powerful, representing an independent provider network. GigGrow Marketplace OS standards, professional graphic design, clean lines, high resolution, 4K quality. NO RED ANYWHERE EXCEPT THE ORANGE HARD HATS. NO PINK TINTS. NO ROSE COLORS.",
            },
          ],
        },
        config: {
          imageConfig: {
            aspectRatio: "1:1",
            imageSize: "4K"
          }
        },
      });

      let base64Data = null;
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          base64Data = part.inlineData.data;
          break;
        }
      }

      if (base64Data) {
        const logoUrl = `data:image/png;base64,${base64Data}`;
        localStorage.setItem('giggrow_4k_logo', logoUrl);
        window.location.reload(); // Refresh to show new logo
      } else {
        throw new Error("No image data received from the model.");
      }
    } catch (err: any) {
      console.error("Logo generation failed:", err);
      if (err.message?.includes("Requested entity was not found")) {
        setError("API Key issue. Please select a valid key again.");
        await (window as any).aistudio.openSelectKey();
      } else if (err.message?.toLowerCase().includes("quota") || err.message?.toLowerCase().includes("limit")) {
        setError("API Quota Exceeded. Please select a different API key or check your Google Cloud billing.");
      } else {
        setError(err.message || "Failed to generate logo.");
      }
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 p-6 rounded-sm border border-ml-accent/30 bg-ml-bg/80 backdrop-blur-sm">
      <div className="flex items-center gap-3 text-ml-accent text-glow-blue">
        <Sparkles className="h-5 w-5" />
        <span className="text-[11px] font-bold uppercase tracking-[0.4em]">GigGrow Asset Engine</span>
      </div>
      
      <p className="text-center text-xs text-ml-sub max-w-xs">
        Generate a 4K cinematic brand logo powered by Gemini 3.1 Flash. 
        Requires a selected API key with image generation capabilities.
      </p>

      <button
        onClick={generateLogo}
        disabled={isGenerating}
        className="usa-button px-8 py-4 text-[10px] font-black uppercase tracking-[0.3em] rounded-sm flex items-center gap-3 disabled:opacity-50"
      >
        {isGenerating ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Generating 4K Asset...
          </>
        ) : (
          <>
            <Sparkles className="h-4 w-4" />
            Generate 4K Logo
          </>
        )}
      </button>

      {error && (
        <div className="text-[10px] font-bold uppercase tracking-[0.1em] text-ml-accent text-glow-blue">
          {error}
        </div>
      )}

      <button 
        onClick={() => (window as any).aistudio.openSelectKey()}
        className="text-[9px] font-bold uppercase tracking-[0.2em] text-ml-sub/60 hover:text-ml-accent transition-colors flex items-center gap-2"
      >
        <Key className="h-3 w-3" />
        Update API Key
      </button>
    </div>
  );
};
