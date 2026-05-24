import { Router } from 'express';
import * as contractController from './contract.controller.ts';
import { authMiddleware, roleGuard } from '../../middleware/auth.ts';

const router = Router();

router.post('/', authMiddleware, roleGuard(['CLIENT']), contractController.createContract);
router.get('/', authMiddleware, contractController.getContracts);
router.get('/:id', authMiddleware, contractController.getContractById);
router.patch('/:id/status', authMiddleware, contractController.updateContractStatus);

// Evidence & Completion
router.post('/:id/evidence', authMiddleware, roleGuard(['PROVIDER']), contractController.addEvidence);
router.get('/:id/evidence', authMiddleware, contractController.getEvidence);
router.post('/:id/complete', authMiddleware, roleGuard(['PROVIDER']), contractController.requestCompletion);
router.post('/:id/approve', authMiddleware, roleGuard(['CLIENT']), contractController.approveCompletion);
router.post('/:id/reject', authMiddleware, roleGuard(['CLIENT']), contractController.rejectCompletion);
router.post('/:id/dispute', authMiddleware, contractController.initiateDispute);

// Tasks
router.post('/:id/tasks', authMiddleware, roleGuard(['CLIENT']), contractController.addTask);
router.get('/:id/tasks', authMiddleware, contractController.getTasks);
router.patch('/:id/tasks/:taskId', authMiddleware, contractController.updateTask);
router.delete('/:id/tasks/:taskId', authMiddleware, roleGuard(['CLIENT']), contractController.deleteTask);

export default router;
