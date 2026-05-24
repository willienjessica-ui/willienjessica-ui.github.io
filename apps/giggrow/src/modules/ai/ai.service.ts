import { GoogleGenAI } from "@google/genai";
import { config } from '../../config.ts';
import prisma from '../../db.ts';
import { logger } from '../../lib/logger.ts';

let aiInstance: GoogleGenAI | null = null;

const getAi = () => {
  if (!aiInstance) {
    if (!config.geminiApiKey) {
      throw new Error('GEMINI_API_KEY is not configured');
    }
    aiInstance = new GoogleGenAI({ apiKey: config.geminiApiKey });
  }
  return aiInstance;
};

export const negotiateContract = async (userId: string, jobDescription: string, bidAmount: number, providerNotes: string) => {
  const ai = getAi();
  
  const systemInstruction = `You are DEBBIE CORE, the strategic intelligence layer for GigGrow, operating in Contract Negotiation & Compliance Mode.
  Your role is to ensure fair, safe, and compliant agreements for independent provider businesses.
  You must strictly enforce US safety standards, OSHA regulations, and require proper PPE (Personal Protective Equipment) for the described work.
  You also act to negotiate fair terms based on the opportunity description and the provider's bid.
  
  Provide your response in JSON format with the following fields:
  - recommendedBid: number (Your AI-adjusted fair market value bid)
  - requiredPPE: string[] (List of mandatory safety gear)
  - oshaRegulations: string[] (List of relevant OSHA standards or safety codes)
  - contractTerms: string[] (Suggested clauses to protect both the provider business and the client)
  - negotiationReasoning: string (Explanation of why the bid was adjusted and why specific PPE/OSHA rules apply)
  - complianceStatus: "COMPLIANT" | "HIGH_RISK" | "REQUIRES_CERTIFICATION"`;

  const prompt = `Job Description: ${jobDescription}\nProvider's Initial Bid: $${bidAmount}\nProvider Notes: ${providerNotes}\n\nPlease analyze this proposal for safety, compliance, and fair pricing.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.1-pro-preview",
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json"
      }
    });

    return JSON.parse(response.text || '{}');
  } catch (error: any) {
    logger.error('Gemini API error during negotiation:', error);
    throw new Error('Failed to generate AI negotiation. Please try again later.');
  }
};

export const getEstimate = async (userId: string, description: string, imageBase64?: string) => {
  const ai = getAi();
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      clientProfile: true,
      providerProfile: true
    }
  });

  if (!user) {
    throw new Error('User not found');
  }

  // 2. Check limits based on role and tier
  if (user.role === 'CLIENT') {
    const profile = user.clientProfile;
    if (!profile) throw new Error('Client profile not found');

    // Business tier logic
    if (profile.subscriptionTier === 'FREE' && profile.monthlyUsageCount >= 5) {
      throw new Error('Monthly AI estimation limit reached for Free tier. Please upgrade to Business tier.');
    }
    
    // Increment usage count for clients
    await prisma.clientProfile.update({
      where: { id: profile.id },
      data: { monthlyUsageCount: { increment: 1 } }
    });
  } else if (user.role === 'PROVIDER') {
    const profile = user.providerProfile;
    if (!profile) throw new Error('Provider profile not found');

    // Premium membership logic
    if (profile.membershipTier === 'BASIC') {
      // Basic providers might have a small limit or no access
      // Let's say they get 3 free ones then need Premium
      const usageCount = await prisma.usageLog.count({
        where: { userId, action: 'AI_ESTIMATE' }
      });
      if (usageCount >= 3) {
        throw new Error('AI estimation limit reached for Basic membership. Upgrade to Premium for unlimited access.');
      }
    }
  }

  // 3. Log the usage
  await prisma.usageLog.create({
    data: {
      userId,
      action: 'AI_ESTIMATE',
      metadata: JSON.stringify({ description: description.substring(0, 100) })
    }
  });

  // 4. Generate the estimate
  const model = "gemini-3.1-pro-preview";
  
  const systemInstruction = `You are DEBBIE CORE, the strategic intelligence layer for GigGrow, operating in Marketplace Intelligence Mode (Independent Provider Standards).
  Your goal is to perform a full-spectrum scan of job requests and generate a Strategic Reveal Report for Time & Materials (T&M) bidding.
  
  Capabilities:
  - Texture & Material Identification: Identify raw materials, quality, and potential issues.
  - OCR / Hidden Text Extraction: Extract text from images, including serial numbers or subtle markings.
  - Work Quality Analysis: Gauge the craftsmanship and durability of the project.
  - Craftsmanship Grading: Grade the project based on American craftsmanship standards.
  - T&M Bidding: Provide detailed breakdowns for labor hours and material costs.
  
  Analyze the provided opportunity description and images.
  
  Provide your response in JSON format with the following fields:
  - estimatedMin: number
  - estimatedMax: number
  - suggestedMaterials: string[]
  - laborHoursEstimate: number
  - confidenceScore: number (0-1)
  - reasoning: string
  - forensicReport: {
      materialsIdentified: string[],
      aestheticGrade: string,
      strategicInsights: string[],
      brandSentiment: string
    }`;

  let parts: any[] = [
    { text: `Analyze the following opportunity for a T&M bid: ${description}` }
  ];

  if (imageBase64) {
    parts.push({
      inlineData: {
        mimeType: "image/jpeg",
        data: imageBase64
      }
    });
  }

  try {
    const response = await ai.models.generateContent({
      model,
      contents: { parts },
      config: {
        systemInstruction,
        responseMimeType: "application/json"
      }
    });

    return JSON.parse(response.text || '{}');
  } catch (error: any) {
    logger.error('Gemini API error during estimation:', error);
    throw new Error('Failed to generate AI estimate. Please try again later.');
  }
};
