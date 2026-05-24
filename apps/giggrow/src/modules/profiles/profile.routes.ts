import { Router } from 'express';
import * as profileController from './profile.controller.ts';
import { authMiddleware } from '../../middleware/auth.ts';

const router = Router();

router.get('/client', authMiddleware, profileController.getClientProfile);
router.put('/client', authMiddleware, profileController.updateClientProfile);
router.post('/client/subscribe', authMiddleware, profileController.upgradeSubscription);
router.get('/provider', authMiddleware, profileController.getProviderProfile);
router.put('/provider', authMiddleware, profileController.updateProviderProfile);
router.post('/provider/upgrade', authMiddleware, profileController.upgradeMembership);

export default router;
