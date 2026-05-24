import { Response } from 'express';
import { AuthRequest } from '../../middleware/auth.ts';
import * as tmService from './tm.service.ts';
import { logger } from '../../lib/logger.ts';

export const addTimeEntry = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
    const entry = await tmService.addTimeEntry(req.params.contractId, req.user.userId, req.body);
    res.status(201).json(entry);
  } catch (error: any) {
    res.status(400).json({ error: 'Time entry failed', message: error.message });
  }
};

export const getTimeEntries = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
    const entries = await tmService.getTimeEntries(req.params.contractId, req.user.userId, req.user.role);
    res.json(entries);
  } catch (error: any) {
    res.status(404).json({ error: 'Not Found', message: error.message });
  }
};

export const addMaterialLine = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
    const line = await tmService.addMaterialLine(req.params.contractId, req.user.userId, req.body);
    res.status(201).json(line);
  } catch (error: any) {
    res.status(400).json({ error: 'Material entry failed', message: error.message });
  }
};

export const getMaterialLines = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
    const lines = await tmService.getMaterialLines(req.params.contractId, req.user.userId, req.user.role);
    res.json(lines);
  } catch (error: any) {
    res.status(404).json({ error: 'Not Found', message: error.message });
  }
};
