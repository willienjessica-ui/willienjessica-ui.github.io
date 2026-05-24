import app from './app.ts';
import { config } from './config.ts';
import { logger } from './lib/logger.ts';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import { Server } from 'socket.io';
import http from 'http';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const PORT = config.port;
  const httpServer = http.createServer(app);
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  // Real-time Job Dispatch Logic
  io.on('connection', (socket) => {
    logger.info(`Operator Connected: ${socket.id}`);

    socket.on('operator:online', (data) => {
      logger.info(`Operator ${data.name} is now ONLINE at ${data.location.lat}, ${data.location.lng}`);
      socket.broadcast.emit('operator:updated', { id: socket.id, ...data });
    });

    socket.on('job:signal', (job) => {
      logger.info(`New Job Signal: ${job.title} at ${job.location.lat}, ${job.location.lng}`);
      io.emit('job:broadcast', { id: Math.random().toString(36).substr(2, 9), ...job });
    });

    socket.on('job:negotiate', (data) => {
      logger.info(`Negotiation Started for Job ${data.jobId} by ${socket.id}`);
      io.emit('negotiation:update', data);
    });

    // Chat Events
    socket.on('chat:join', (contractId) => {
      socket.join(`contract:${contractId}`);
      logger.info(`User ${socket.id} joined chat for contract ${contractId}`);
    });

    socket.on('chat:message', (data) => {
      // data: { contractId, message }
      io.to(`contract:${data.contractId}`).emit('chat:message', data.message);
    });

    socket.on('disconnect', () => {
      logger.info(`Operator Disconnected: ${socket.id}`);
      io.emit('operator:offline', { id: socket.id });
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(path.join('/', 'assets'), (req, res, next) => {
      next();
    });
    app.use(path.join('/'), (req, res, next) => {
      if (req.url.startsWith('/api') || req.url.startsWith('/health') || req.url.startsWith('/ready')) {
        return next();
      }
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  httpServer.listen(Number(PORT), '0.0.0.0', () => {
    logger.info(`GigGrow Server running on http://0.0.0.0:${PORT}`);
  });

  // Graceful shutdown
  process.on('SIGTERM', () => {
    logger.info('SIGTERM signal received: closing HTTP server');
    httpServer.close(() => {
      logger.info('HTTP server closed');
    });
  });
}

startServer().catch((err) => {
  logger.error('Failed to start server:', err);
  process.exit(1);
});
