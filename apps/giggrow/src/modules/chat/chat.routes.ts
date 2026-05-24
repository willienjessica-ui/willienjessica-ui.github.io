import { Router } from "express";
import { authMiddleware as authenticate } from "../../middleware/auth";
import { getMessages, sendMessage } from "./chat.controller";

const router = Router();

router.get("/:contractId", authenticate, getMessages);
router.post("/:contractId", authenticate, sendMessage);

export default router;
