import { Router } from 'express';
import { getMatches } from './matching.controller.ts';
import { authMiddleware } from '../../middleware/auth.ts';

const router = Router();

router.get('/', authMiddleware, getMatches);

export default router;
