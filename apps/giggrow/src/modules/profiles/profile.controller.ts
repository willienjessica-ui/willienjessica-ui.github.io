import { Response } from 'express';
import { AuthRequest } from '../../middleware/auth.ts';
import * as profileService from './profile.service.ts';
import { logger } from '../../lib/logger.ts';

export const getClientProfile = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
    const profile = await profileService.getClientProfile(req.user.userId);
    res.json(profile);
  } catch (error: any) {
    res.status(404).json({ error: 'Not Found', message: error.message });
  }
};

export const updateClientProfile = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
    const profile = await profileService.updateClientProfile(req.user.userId, req.body);
    res.json(profile);
  } catch (error: any) {
    res.status(400).json({ error: 'Update failed', message: error.message });
  }
};

export const getProviderProfile = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
    const profile = await profileService.getProviderProfile(req.user.userId);
    res.json(profile);
  } catch (error: any) {
    res.status(404).json({ error: 'Not Found', message: error.message });
  }
};

export const updateProviderProfile = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
    const profile = await profileService.updateProviderProfile(req.user.userId, req.body);
    res.json(profile);
  } catch (error: any) {
    res.status(400).json({ error: 'Update failed', message: error.message });
  }
};

export const upgradeMembership = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
    const { tier } = req.body;
    const profile = await profileService.upgradeMembership(req.user.userId, tier);
    res.json(profile);
  } catch (error: any) {
    res.status(400).json({ error: 'Upgrade failed', message: error.message });
  }
};

export const upgradeSubscription = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
    const { tier } = req.body;
    const profile = await profileService.upgradeSubscription(req.user.userId, tier);
    res.json(profile);
  } catch (error: any) {
    res.status(400).json({ error: 'Subscription failed', message: error.message });
  }
};
