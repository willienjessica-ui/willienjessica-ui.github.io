import express from 'express';
import cors from 'cors';
import { logger } from './lib/logger.ts';

import authRoutes from './modules/auth/auth.routes.ts';
import profileRoutes from './modules/profiles/profile.routes.ts';
import verificationRoutes from './modules/verification/verification.routes.ts';
import jobRoutes from './modules/jobs/job.routes.ts';
import contractRoutes from './modules/contracts/contract.routes.ts';
import paymentRoutes from './modules/payments/payment.routes.ts';
import tmRoutes from './modules/time-materials/tm.routes.ts';
import aiRoutes from './modules/ai/ai.routes.ts';
import chatRoutes from './modules/chat/chat.routes.ts';
import debbieRoutes from './modules/debbie/debbie.routes.ts';
import matchingRoutes from './modules/matching/matching.routes.ts';

const app = express();

app.use(cors());
app.use(express.json({
  verify: (req: any, res, buf) => {
    req.rawBody = buf;
  }
}));

// Request logging middleware
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/profiles', profileRoutes);
app.use('/api/verification', verificationRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/contracts', contractRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/tm', tmRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/chat/debbie', debbieRoutes);
app.use('/api/matching', matchingRoutes);

// Health endpoints
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/ready', (req, res) => {
  res.json({ status: 'ready' });
});

// API Routes Placeholder
app.get('/api/config', (req, res) => {
  res.json({
    appName: 'GigGrow',
    version: '1.0.0-baseline'
  });
});

import { errorHandler } from './middleware/error.ts';

// Error handling middleware
app.use(errorHandler);

export default app;
