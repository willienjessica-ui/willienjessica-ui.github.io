import jwt from 'jsonwebtoken';
import { config } from '../config.ts';

export const generateToken = (userId: string, role: string) => {
  return jwt.sign({ userId, role }, config.jwtSecret, {
    expiresIn: '7d',
  });
};

export const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, config.jwtSecret) as { userId: string; role: string };
  } catch (error) {
    return null;
  }
};
