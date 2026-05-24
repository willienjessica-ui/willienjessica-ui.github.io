import { GoogleGenAI } from '@google/genai';
import { DebbieChatRequest, DebbieChatResponse, DebbieMode, DebbieMemoryItem } from './debbie.types.ts';
import { buildDebbieSystemPrompt } from './debbie.prompts.ts';

export class DebbieService {
  private readonly model = 'gemini-3-flash-preview';

  private getAiClient(): GoogleGenAI {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error('Missing GEMINI_API_KEY environment variable');
    }
    return new GoogleGenAI({ apiKey: key });
  }

  private inferMode(input?: string): DebbieMode {
    const raw = (input || '').toLowerCase();

    if (raw.includes('govbid')) return 'govbid';
    if (raw.includes('contract')) return 'contracts';
    if (raw.includes('job')) return 'jobs';
    if (raw.includes('dispatch')) return 'dispatch';
    if (raw.includes('operator')) return 'operators';
    if (raw.includes('intel')) return 'intel';

    return 'general';
  }

  private normalizeMode(request: DebbieChatRequest): DebbieMode {
    if (request.mode) return request.mode;
    if (request.metadata?.activeTab) return this.inferMode(request.metadata.activeTab);
    return this.inferMode(request.message);
  }

  private buildMemoryContext(memory: DebbieMemoryItem[] = []): string {
    if (!memory.length) return 'No prior conversation memory supplied.';

    const trimmed = memory.slice(-10); // keep it sane for token cost
    const lines = trimmed.map((m, i) => {
      const ts = m.timestamp ? ` [${m.timestamp}]` : '';
      return `${i + 1}. ${m.role.toUpperCase()}${ts}: ${m.content}`;
    });

    return `Recent memory context:\n${lines.join('\n')}`;
  }

  private buildMetadataContext(request: DebbieChatRequest): string {
    const meta = request.metadata || {};
    const pairs = Object.entries(meta).filter(([, v]) => v !== undefined && v !== null && v !== '');

    if (!pairs.length) return 'No metadata provided.';

    return `Session metadata:\n${pairs.map(([k, v]) => `- ${k}: ${v}`).join('\n')}`;
  }

  private buildUserPrompt(request: DebbieChatRequest, mode: DebbieMode): string {
    const memoryContext = this.buildMemoryContext(request.memory);
    const metadataContext = this.buildMetadataContext(request);

    return `
DEBBIE SESSION MODE: ${mode.toUpperCase()}

${metadataContext}

${memoryContext}

User request:
${request.message}

Instructions:
- Respond as Debbie Core.
- Be useful immediately.
- Prefer tactical structure.
- If relevant, include:
  1. assessment
  2. risk / leverage
  3. recommended action
  4. next best move
`;
  }

  public async chat(request: DebbieChatRequest): Promise<DebbieChatResponse> {
    if (!request?.message || !request.message.trim()) {
      throw new Error('Debbie message is required.');
    }

    const mode = this.normalizeMode(request);
    const systemPrompt = buildDebbieSystemPrompt(mode);
    const userPrompt = this.buildUserPrompt(request, mode);

    const ai = this.getAiClient();

    const response = await ai.models.generateContent({
      model: this.model,
      contents: userPrompt,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.7,
        topP: 0.9,
        topK: 40,
        tools: [{ googleSearch: {} }], // Added Search Grounding
      },
    });

    const reply = response.text || '';

    if (!reply) {
      throw new Error('Gemini returned empty response.');
    }

    return {
      ok: true,
      mode,
      reply,
      timestamp: new Date().toISOString(),
      debug: {
        model: this.model,
        usedMemoryCount: request.memory?.length || 0,
      },
    };
  }
}

export const debbieService = new DebbieService();
