import { Response } from 'express';
import { AuthRequest } from '../../middleware/auth.ts';
import * as verificationService from './verification.service.ts';
import { logger } from '../../lib/logger.ts';

export const submitVerification = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
    const { type, metadata } = req.body;
    const verification = await verificationService.createVerification(req.user.userId, type, metadata);
    res.status(201).json(verification);
  } catch (error: any) {
    res.status(400).json({ error: 'Submission failed', message: error.message });
  }
};

export const getVerificationStatus = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
    const verifications = await verificationService.getUserVerifications(req.user.userId);
    res.json(verifications);
  } catch (error: any) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
