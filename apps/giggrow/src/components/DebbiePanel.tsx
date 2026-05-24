import React, { useState, useRef, useEffect } from 'react';
import { Loader2, Send, Mic, Image as ImageIcon, Search, X, MessageSquare, Terminal } from 'lucide-react';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';
import { apiFetch } from '../lib/api';
import { NeoDasConsole } from './NeoDasConsole';

// Local types for the frontend component
export type DebbieMode = 'general' | 'dispatch' | 'operators' | 'intel' | 'govbid' | 'contracts' | 'jobs';
export interface DebbieMemoryItem {
  role: 'user' | 'model' | 'system';
  content: string;
  timestamp?: string;
}

export const DebbiePanel: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'voice' | 'image' | 'kernel'>('chat');
  
  // Chat State
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<DebbieMemoryItem[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Voice State
  const [isListening, setIsListening] = useState(false);
  const [voiceStatus, setVoiceStatus] = useState('Idle');
  const sessionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Image State
  const [imagePrompt, setImagePrompt] = useState('');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    const userMsg = message;
    setMessage('');
    
    const newHistory: DebbieMemoryItem[] = [
      ...chatHistory,
      { role: 'user', content: userMsg, timestamp: new Date().toISOString() }
    ];
    setChatHistory(newHistory);
    setIsTyping(true);

    try {
      const response = await apiFetch('/api/chat/debbie', {
        method: 'POST',
        body: JSON.stringify({
          message: userMsg,
          memory: chatHistory,
          metadata: {
            activeTab: 'general',
            companyName: 'GigGrow',
          }
        })
      });

      setChatHistory([
        ...newHistory,
        { role: 'model', content: response.reply, timestamp: response.timestamp }
      ]);
    } catch (error: any) {
      setChatHistory([
        ...newHistory,
        { role: 'model', content: `Error: ${error.message}`, timestamp: new Date().toISOString() }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const toggleVoice = async () => {
    if (isListening) {
      sessionRef.current?.close();
      audioContextRef.current?.close();
      setIsListening(false);
      setVoiceStatus('Idle');
      return;
    }

    try {
      setVoiceStatus('Connecting...');
      const key = import.meta.env.VITE_GEMINI_API_KEY;
      const ai = new GoogleGenAI({ apiKey: key });
      
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const source = audioContextRef.current.createMediaStreamSource(stream);
      const processor = audioContextRef.current.createScriptProcessor(4096, 1, 1);
      
      source.connect(processor);
      processor.connect(audioContextRef.current.destination);

      const sessionPromise = ai.live.connect({
        model: "gemini-3.1-flash-live-preview",
        callbacks: {
          onopen: () => {
            setIsListening(true);
            setVoiceStatus('Listening...');
            
            processor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const pcm16 = new Int16Array(inputData.length);
              for (let i = 0; i < inputData.length; i++) {
                pcm16[i] = Math.max(-32768, Math.min(32767, inputData[i] * 32768));
              }
              
              const base64Data = btoa(String.fromCharCode(...new Uint8Array(pcm16.buffer)));
              sessionPromise.then((session) =>
                session.sendRealtimeInput({
                  audio: { data: base64Data, mimeType: 'audio/pcm;rate=16000' }
                })
              );
            };
          },
          onmessage: async (msg: LiveServerMessage) => {
            const base64Audio = msg.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (base64Audio) {
              setVoiceStatus('Speaking...');
              const binary = atob(base64Audio);
              const bytes = new Uint8Array(binary.length);
              for (let i = 0; i < binary.length; i++) {
                bytes[i] = binary.charCodeAt(i);
              }
              
              if (audioContextRef.current) {
                const audioBuffer = await audioContextRef.current.decodeAudioData(bytes.buffer);
                const source = audioContextRef.current.createBufferSource();
                source.buffer = audioBuffer;
                source.connect(audioContextRef.current.destination);
                source.start();
                source.onended = () => setVoiceStatus('Listening...');
              }
            }
          },
          onclose: () => {
            setIsListening(false);
            setVoiceStatus('Idle');
            processor.disconnect();
            source.disconnect();
          }
        },
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: "Zephyr" } },
          },
          systemInstruction: "You are DEBBIE CORE, the strategic intelligence layer for GigGrow, running on the NeoDas V3.0 Sovereign OS. You are connected via the NeoDas Intelligence Bridge to the MorrisSoft Core. Be direct, tactical, and intelligent. You manage requested marketplace operations while the kernel manages the hardware.",
        },
      });
      
      sessionRef.current = await sessionPromise;
    } catch (error) {
      console.error("Voice error:", error);
      setVoiceStatus('Error connecting');
      setIsListening(false);
    }
  };

  const handleGenerateImage = async () => {
    if (!imagePrompt.trim()) return;
    setIsGeneratingImage(true);
    setGeneratedImage(null);

    try {
      const key = import.meta.env.VITE_GEMINI_API_KEY;
      const ai = new GoogleGenAI({ apiKey: key });
      
      const response = await ai.models.generateContent({
        model: 'gemini-3.1-flash-image-preview',
        contents: {
          parts: [{ text: imagePrompt }],
        },
        config: {
          imageConfig: {
            aspectRatio: "1:1",
            imageSize: "1K"
          }
        },
      });

      for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
          setGeneratedImage(`data:image/png;base64,${part.inlineData.data}`);
          break;
        }
      }
    } catch (error) {
      console.error("Image generation error:", error);
    } finally {
      setIsGeneratingImage(false);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-[#00f0ff] to-[#00b0ff] text-[#0a0a1f] shadow-[0_0_20px_rgba(0,240,255,0.4)] transition hover:scale-110 z-50"
      >
        <MessageSquare className="h-6 w-6" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex h-[600px] w-[400px] flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0a0a1f]/95 shadow-2xl backdrop-blur-xl">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 bg-white/5 px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-[#00f0ff] shadow-[0_0_10px_#00f0ff] animate-pulse" />
          <span className="text-sm font-black uppercase tracking-widest text-white">DEBBIE CORE</span>
          <span className="ml-2 text-[8px] font-bold text-[#00f0ff]/60 border border-[#00f0ff]/20 px-1 rounded uppercase">Sovereign Bridge: Active</span>
        </div>
        <button onClick={() => setIsOpen(false)} className="text-white/60 hover:text-white">
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-white/10">
        <button
          onClick={() => setActiveTab('chat')}
          className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider transition ${activeTab === 'chat' ? 'bg-white/10 text-[#00f0ff]' : 'text-white/50 hover:bg-white/5'}`}
        >
          Command
        </button>
        <button
          onClick={() => setActiveTab('voice')}
          className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider transition ${activeTab === 'voice' ? 'bg-white/10 text-[#00f0ff]' : 'text-white/50 hover:bg-white/5'}`}
        >
          Voice Link
        </button>
        <button
          onClick={() => setActiveTab('image')}
          className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider transition ${activeTab === 'image' ? 'bg-white/10 text-[#00f0ff]' : 'text-white/50 hover:bg-white/5'}`}
        >
          Visuals
        </button>
        <button
          onClick={() => setActiveTab('kernel')}
          className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider transition ${activeTab === 'kernel' ? 'bg-white/10 text-[#00f0ff]' : 'text-white/50 hover:bg-white/5'}`}
        >
          Kernel
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === 'chat' && (
          <div className="flex h-full flex-col gap-4">
            {chatHistory.length === 0 && (
              <div className="flex h-full flex-col items-center justify-center text-center text-white/40">
                <Search className="mb-2 h-8 w-8 opacity-50" />
                <p className="text-sm">Debbie Core initialized.</p>
                <p className="text-xs">Awaiting command input.</p>
              </div>
            )}
            {chatHistory.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-xl px-4 py-2 text-sm ${msg.role === 'user' ? 'bg-[#00f0ff]/20 text-[#00f0ff]' : 'bg-white/10 text-white'}`}>
                  {msg.content}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="rounded-xl bg-white/10 px-4 py-2 text-sm text-white/60">
                  <Loader2 className="h-4 w-4 animate-spin" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}

        {activeTab === 'voice' && (
          <div className="flex h-full flex-col items-center justify-center gap-6">
            <div className={`relative flex h-32 w-32 items-center justify-center rounded-full border-2 transition-all duration-500 ${isListening ? 'border-[#00f0ff] shadow-[0_0_50px_rgba(0,240,255,0.3)]' : 'border-white/20'}`}>
              {isListening && (
                <div className="absolute inset-0 animate-ping rounded-full border border-[#00f0ff] opacity-20" />
              )}
              <Mic className={`h-12 w-12 ${isListening ? 'text-[#00f0ff]' : 'text-white/40'}`} />
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-white">{voiceStatus}</p>
              <p className="text-xs text-white/50 mt-1">Real-time tactical audio link</p>
            </div>
            <button
              onClick={toggleVoice}
              className={`mt-4 rounded-md px-8 py-3 text-xs font-black uppercase tracking-widest transition ${isListening ? 'bg-red-500/20 text-red-500 hover:bg-red-500/30' : 'bg-[#00f0ff]/20 text-[#00f0ff] hover:bg-[#00f0ff]/30'}`}
            >
              {isListening ? 'Terminate Link' : 'Establish Link'}
            </button>
          </div>
        )}

        {activeTab === 'image' && (
          <div className="flex h-full flex-col gap-4">
            <div className="flex-1 rounded-xl border border-white/10 bg-black/50 overflow-hidden flex items-center justify-center">
              {isGeneratingImage ? (
                <div className="flex flex-col items-center text-[#00f0ff]">
                  <Loader2 className="h-8 w-8 animate-spin mb-2" />
                  <span className="text-xs font-bold uppercase tracking-widest">Rendering...</span>
                </div>
              ) : generatedImage ? (
                <img src={generatedImage} alt="Generated" className="h-full w-full object-cover" />
              ) : (
                <div className="flex flex-col items-center text-white/30">
                  <ImageIcon className="h-12 w-12 mb-2 opacity-50" />
                  <span className="text-xs uppercase tracking-widest">No Visual Data</span>
                </div>
              )}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={imagePrompt}
                onChange={(e) => setImagePrompt(e.target.value)}
                placeholder="Describe visual requirement..."
                className="flex-1 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-white placeholder-white/30 focus:border-[#00f0ff]/50 focus:outline-none"
                onKeyDown={(e) => e.key === 'Enter' && handleGenerateImage()}
              />
              <button
                onClick={handleGenerateImage}
                disabled={isGeneratingImage || !imagePrompt.trim()}
                className="flex items-center justify-center rounded-lg bg-[#00f0ff] px-4 text-[#0a0a1f] transition hover:bg-[#00b0ff] disabled:opacity-50"
              >
                <ImageIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {activeTab === 'kernel' && (
          <div className="h-full overflow-hidden rounded-lg border border-white/10">
            <NeoDasConsole />
          </div>
        )}
      </div>

      {/* Chat Input (Only visible on chat tab) */}
      {activeTab === 'chat' && (
        <div className="border-t border-white/10 p-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Enter command..."
              className="flex-1 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-white placeholder-white/30 focus:border-[#00f0ff]/50 focus:outline-none"
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            />
            <button
              onClick={handleSendMessage}
              disabled={isTyping || !message.trim()}
              className="flex items-center justify-center rounded-lg bg-[#00f0ff] px-4 text-[#0a0a1f] transition hover:bg-[#00b0ff] disabled:opacity-50"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
