import { Router } from 'express';
import * as aiController from './ai.controller.ts';
import { authMiddleware } from '../../middleware/auth.ts';

const router = Router();

router.post('/estimate', authMiddleware, aiController.generateEstimate);
router.post('/negotiate', authMiddleware, aiController.negotiateContract);

export default router;
