import { Router } from 'express';
import * as paymentController from './payment.controller.ts';
import { authMiddleware } from '../../middleware/auth.ts';

const router = Router();

router.post('/create-intent', authMiddleware, paymentController.createPaymentIntent);
router.post('/create-subscription', authMiddleware, paymentController.createSubscription);
router.post('/confirm', authMiddleware, paymentController.confirmPayment);
router.post('/refund', authMiddleware, paymentController.refundPayment);
router.get('/telemetry', authMiddleware, paymentController.getTelemetry);
router.post('/webhook', paymentController.handleWebhook);
router.get('/contract/:contractId', authMiddleware, paymentController.getContractPayments);

// Seam 6: Honeypot catch-all
router.all('*', paymentController.handleHoneypot);

export default router;
