import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../lib/jwt.ts';
import { logger } from '../lib/logger.ts';

import prisma from '../db.ts';

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    role: string;
    status: string;
  };
}

export const authMiddleware = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized', message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];
  const decoded = verifyToken(token);

  if (!decoded) {
    return res.status(401).json({ error: 'Unauthorized', message: 'Invalid or expired token' });
  }

  // Fetch latest user status
  const user = await prisma.user.findUnique({ where: { id: decoded.userId } });
  if (!user || user.status === 'SUSPENDED') {
    return res.status(403).json({ error: 'Forbidden', message: 'Account is suspended or does not exist' });
  }

  req.user = { ...decoded, status: user.status };
  next();
};

export const verificationGuard = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
  
  if (req.user.role === 'PROVIDER' && req.user.status !== 'ACTIVE') {
    return res.status(403).json({ error: 'Forbidden', message: 'Provider verification required' });
  }
  
  next();
};

export const roleGuard = (allowedRoles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Forbidden', message: 'Insufficient permissions' });
    }

    next();
  };
};
