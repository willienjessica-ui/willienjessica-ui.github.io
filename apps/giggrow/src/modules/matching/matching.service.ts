import { GoogleGenAI, Type } from '@google/genai';
import prisma from '../../db.ts';
import { MatchScore } from './matching.types.ts';

export class MatchingService {
  private getAiClient(): GoogleGenAI {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error('Missing GEMINI_API_KEY environment variable');
    }
    return new GoogleGenAI({ apiKey: key });
  }

  public async getMatches(userId: string): Promise<MatchScore[]> {
    const provider = await prisma.providerProfile.findUnique({
      where: { userId },
    });
    if (!provider) throw new Error('Provider profile not found');

    const jobs = await prisma.job.findMany({
      where: { status: 'OPEN', isPublic: true },
    });

    if (jobs.length === 0) return [];

    const ai = this.getAiClient();

    const prompt = `
      You are an expert opportunity-matching assistant for GigGrow, a marketplace for independent provider businesses.
      Analyze the provider profile and the list of open opportunities to score the match.
      
      Provider Profile:
      - Display Name: ${provider.displayName}
      - Trade: ${provider.trade}
      - Experience: ${provider.experience}
      - Service Area: ${provider.serviceArea}

      Open Opportunities:
      ${JSON.stringify(jobs.map(j => ({ id: j.id, title: j.title, description: j.description, category: j.category, location: j.location })))}

      Return a JSON array of objects, each with:
      - jobId: the job ID
      - score: a number from 0 to 100 representing the match quality
      - reasoning: a brief explanation of the match
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              jobId: { type: Type.STRING },
              score: { type: Type.NUMBER },
              reasoning: { type: Type.STRING },
            },
            required: ['jobId', 'score', 'reasoning'],
          },
        },
      },
    });

    const jsonStr = response.text || '[]';
    return JSON.parse(jsonStr);
  }
}

export const matchingService = new MatchingService();
