import { PrismaClient } from '@prisma/client';
import { logger } from './lib/logger.ts';
import dotenv from 'dotenv';

dotenv.config();

// Ensure DATABASE_URL is set for Prisma, defaulting to SQLite
if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = 'file:./dev.db';
}

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});

// Test connection
prisma.$connect()
  .then(() => logger.info('Prisma connected to database'))
  .catch((err) => logger.error('Prisma connection failed:', err));

export default prisma;
