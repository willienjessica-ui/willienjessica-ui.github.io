import { Router } from 'express';
import * as tmController from './tm.controller.ts';
import { authMiddleware, roleGuard } from '../../middleware/auth.ts';

const router = Router();

router.post('/:contractId/time-entries', authMiddleware, roleGuard(['PROVIDER']), tmController.addTimeEntry);
router.get('/:contractId/time-entries', authMiddleware, tmController.getTimeEntries);
router.post('/:contractId/materials', authMiddleware, roleGuard(['PROVIDER']), tmController.addMaterialLine);
router.get('/:contractId/materials', authMiddleware, tmController.getMaterialLines);

export default router;
