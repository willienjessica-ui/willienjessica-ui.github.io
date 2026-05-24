import { Router } from 'express';
import * as jobController from './job.controller.ts';
import { authMiddleware, roleGuard } from '../../middleware/auth.ts';

const router = Router();

router.post('/', authMiddleware, roleGuard(['CLIENT']), jobController.createJob);
router.get('/', authMiddleware, jobController.getJobs);
router.get('/:id', authMiddleware, jobController.getJobById);
router.patch('/:id', authMiddleware, roleGuard(['CLIENT']), jobController.updateJob);
router.patch('/:id/status', authMiddleware, roleGuard(['CLIENT', 'ADMIN']), jobController.updateJobStatus);

// Applications nested under jobs
router.post('/:id/applications', authMiddleware, roleGuard(['PROVIDER']), jobController.applyToJob);
router.get('/:id/applications', authMiddleware, jobController.getJobApplications);

// Application actions
router.post('/applications/:applicationId/accept', authMiddleware, roleGuard(['CLIENT']), jobController.acceptApplication);
router.post('/applications/:applicationId/reject', authMiddleware, roleGuard(['CLIENT']), jobController.rejectApplication);

export default router;
