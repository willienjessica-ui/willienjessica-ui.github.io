import { Router } from 'express';
import * as verificationController from './verification.controller.ts';
import { authMiddleware } from '../../middleware/auth.ts';

const router = Router();

router.post('/submit', authMiddleware, verificationController.submitVerification);
router.get('/status', authMiddleware, verificationController.getVerificationStatus);

export default router;
