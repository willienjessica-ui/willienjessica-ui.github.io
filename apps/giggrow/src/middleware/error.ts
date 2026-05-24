import { Request, Response, NextFunction } from 'express';
import { logger } from '../lib/logger.ts';
import { AppError } from '../lib/errors.ts';
import { Prisma } from '@prisma/client';

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  let error = err;

  // Prisma specific errors
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2002') {
      error = new AppError('Duplicate field value entered', 400);
    } else if (err.code === 'P2025') {
      error = new AppError('Record not found', 404);
    } else {
      error = new AppError(`Database error: ${err.message}`, 400);
    }
  } else if (err instanceof Prisma.PrismaClientValidationError) {
    error = new AppError('Invalid data provided', 400);
  }

  if (error instanceof AppError) {
    if (!error.isOperational) {
      logger.error('Programming error:', error);
    } else {
      logger.warn(`Operational error: ${error.message}`);
    }

    return res.status(error.statusCode).json({
      status: 'error',
      message: error.message,
      ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
    });
  }

  // Unhandled errors
  logger.error('Unhandled error:', error);
  
  return res.status(500).json({
    status: 'error',
    message: 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
  });
};
