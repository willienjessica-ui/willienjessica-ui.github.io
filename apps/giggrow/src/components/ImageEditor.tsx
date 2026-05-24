import React, { useState, useRef } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Image as ImageIcon, Loader2, Sparkles, Upload, Key, Eraser, Cpu } from 'lucide-react';

export const ImageEditor: React.FC = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [prompt, setPrompt] = useState("Perform a high-resolution vision scan of this media. Identify all brand markers, texture details, and strategic opportunities. Refine the asset to GigGrow Marketplace OS standards: 4K resolution, sharp 'GIGGROW' typography with electric blue lightning glow, and heroic provider-network imagery. NO ARTIFACTS.");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const processImage = async () => {
    if (!selectedImage) {
      setError("Please upload an image first.");
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      // Check if API key is selected
      if (!(await (window as any).aistudio.hasSelectedApiKey())) {
        await (window as any).aistudio.openSelectKey();
      }

      const apiKey = (typeof process !== 'undefined' && process.env) ? (process.env as any).API_KEY : '';
      const ai = new GoogleGenAI({ apiKey });
      
      // Extract base64 and mime type
      const base64Data = selectedImage.split(',')[1];
      const mimeType = selectedImage.split(',')[0].split(':')[1].split(';')[0];

      const response = await ai.models.generateContent({
        model: 'gemini-3.1-flash-image-preview',
        contents: {
          parts: [
            {
              inlineData: {
                data: base64Data,
                mimeType: mimeType,
              },
            },
            {
              text: prompt,
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

      let resultBase64 = null;
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          resultBase64 = part.inlineData.data;
          break;
        }
      }

      if (resultBase64) {
        const logoUrl = `data:image/png;base64,${resultBase64}`;
        localStorage.setItem('giggrow_4k_logo', logoUrl);
        window.location.reload(); // Refresh to show new logo
      } else {
        throw new Error("No image data received from the model.");
      }
    } catch (err: any) {
      console.error("Image processing failed:", err);
      if (err.message?.includes("Requested entity was not found")) {
        setError("API Key issue. Please select a valid key again.");
        await (window as any).aistudio.openSelectKey();
      } else if (err.message?.toLowerCase().includes("quota") || err.message?.toLowerCase().includes("limit")) {
        setError("API Quota Exceeded. Please select a different API key or check your Google Cloud billing.");
      } else {
        setError(err.message || "Failed to process image.");
      }
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-6 p-10 rounded-sm border border-ml-accent/30 bg-ml-bg/80 backdrop-blur-sm max-w-2xl mx-auto panel-usa">
      <div className="flex items-center gap-3 text-ml-accent text-glow-blue">
        <Cpu className="h-6 w-6" />
        <span className="text-[12px] font-bold uppercase tracking-[0.5em]">GigGrow Vision Lab</span>
      </div>
      
      <div className="grid gap-8 md:grid-cols-2 w-full">
        <div className="space-y-4">
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="group relative aspect-square cursor-pointer overflow-hidden rounded-sm border-2 border-dashed border-ml-accent/20 bg-ml-accent/5 transition-all hover:bg-ml-accent/10"
          >
            {selectedImage ? (
              <img src={selectedImage} alt="Selected" className="h-full w-full object-cover opacity-60 group-hover:opacity-80 transition-opacity" />
            ) : (
              <div className="flex h-full flex-col items-center justify-center gap-3 text-ml-sub">
                <Upload className="h-8 w-8" />
                <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Upload Source</span>
              </div>
            )}
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleImageUpload} 
              className="hidden" 
              accept="image/*"
            />
          </div>
          {selectedImage && (
            <button 
              onClick={() => setSelectedImage(null)}
              className="flex w-full items-center justify-center gap-2 text-[9px] font-bold uppercase tracking-[0.2em] text-ml-accent/60 hover:text-ml-accent transition-colors"
            >
              <Eraser className="h-3 w-3" />
              Clear Image
            </button>
          )}
        </div>

        <div className="flex flex-col justify-between gap-4">
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-ml-sub">Vision Directives</label>
            <textarea 
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full h-32 rounded-sm border border-ml-accent/20 bg-ml-surface/50 p-4 text-xs text-ml-text focus:border-ml-accent focus:outline-none transition-colors resize-none"
              placeholder="Enter vision directives..."
            />
          </div>

          <button
            onClick={processImage}
            disabled={isProcessing || !selectedImage}
            className="usa-button w-full py-5 text-[10px] font-black uppercase tracking-[0.3em] rounded-sm flex items-center justify-center gap-3 disabled:opacity-50"
          >
            {isProcessing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Executing Vision Scan...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Generate Strategic Reveal
              </>
            )}
          </button>
        </div>
      </div>

      {error && (
        <div className="text-[10px] font-bold uppercase tracking-[0.1em] text-ml-accent text-glow-blue">
          {error}
        </div>
      )}

      <div className="flex items-center gap-6 pt-4 border-t border-ml-accent/20 w-full justify-center">
        <button 
          onClick={() => (window as any).aistudio.openSelectKey()}
          className="text-[9px] font-bold uppercase tracking-[0.2em] text-ml-sub/60 hover:text-ml-accent transition-colors flex items-center gap-2"
        >
          <Key className="h-3 w-3" />
          Update API Key
        </button>
      </div>
    </div>
  );
};
