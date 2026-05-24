import { Request, Response } from 'express';
import { debbieService } from './debbie.service.ts';
import { DebbieChatRequest } from './debbie.types.ts';

export class DebbieController {
  public async chat(req: Request, res: Response) {
    try {
      const body = req.body as DebbieChatRequest;
      const result = await debbieService.chat(body);

      return res.status(200).json(result);
    } catch (error: any) {
      console.error('[DEBBIE_CHAT_ERROR]', error);

      return res.status(500).json({
        ok: false,
        mode: 'general',
        reply: 'Debbie Core encountered a system fault while processing the request.',
        timestamp: new Date().toISOString(),
        error: error?.message || 'Unknown Debbie error',
      });
    }
  }
}

export const debbieController = new DebbieController();
