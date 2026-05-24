import { Response } from 'express';
import { AuthRequest } from '../../middleware/auth.ts';
import * as aiService from './ai.service.ts';
import { logger } from '../../lib/logger.ts';

export const generateEstimate = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
    const { jobDescription, imageBase64 } = req.body;
    const estimate = await aiService.getEstimate(req.user.userId, jobDescription, imageBase64);
    res.json(estimate);
  } catch (error: any) {
    logger.error('AI Estimate error:', error);
    res.status(500).json({ error: 'AI Estimation failed', message: error.message });
  }
};

export const negotiateContract = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
    const { jobDescription, bidAmount, providerNotes } = req.body;
    if (!jobDescription || bidAmount == null) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    const negotiation = await aiService.negotiateContract(req.user.userId, jobDescription, bidAmount, providerNotes || '');
    res.json(negotiation);
  } catch (error: any) {
    logger.error('AI Negotiation error:', error);
    res.status(500).json({ error: 'AI Negotiation failed', message: error.message });
  }
};
