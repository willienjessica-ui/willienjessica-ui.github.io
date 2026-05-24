import { Response } from "express";
import { AuthRequest } from "../../middleware/auth";
import { chatService } from "./chat.service";

export const getMessages = async (req: AuthRequest, res: Response) => {
  try {
    const { contractId } = req.params;
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const messages = await chatService.getMessages(contractId, userId);
    res.json(messages);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const sendMessage = async (req: AuthRequest, res: Response) => {
  try {
    const { contractId } = req.params;
    const { content } = req.body;
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (!content || content.trim() === "") {
      return res.status(400).json({ error: "Message content is required" });
    }

    const message = await chatService.sendMessage(contractId, userId, content);
    res.status(201).json(message);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};
