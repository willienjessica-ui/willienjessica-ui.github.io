import { Request, Response } from 'express';
import * as authService from './auth.service.ts';
import { AuthRequest } from '../../middleware/auth.ts';
import { logger } from '../../lib/logger.ts';

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, role } = req.body;
    
    if (!email || !password || !role) {
      return res.status(400).json({ error: 'Bad Request', message: 'Email, password and role are required' });
    }

    const user = await authService.registerUser(email, password, role);
    res.status(201).json(user);
  } catch (error: any) {
    logger.error('Registration error:', error);
    res.status(400).json({ error: 'Registration failed', message: error.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Bad Request', message: 'Email and password are required' });
    }

    const result = await authService.loginUser(email, password);
    res.json(result);
  } catch (error: any) {
    logger.error('Login error:', error);
    res.status(401).json({ error: 'Login failed', message: error.message });
  }
};

export const me = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
    
    const user = await authService.getUserById(req.user.userId);
    res.json(user);
  } catch (error: any) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
