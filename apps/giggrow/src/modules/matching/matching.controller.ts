import { Request, Response } from 'express';
import { matchingService } from './matching.service.ts';

export const getMatches = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const matches = await matchingService.getMatches(userId);
    res.json(matches);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
