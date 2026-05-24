import { Router } from 'express';
import { debbieController } from './debbie.controller.ts';

const router = Router();

router.post('/', (req, res) => debbieController.chat(req, res));

export default router;
