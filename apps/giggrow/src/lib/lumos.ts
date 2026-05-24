import { logger } from './logger.ts';
import crypto from 'crypto';

export interface LumosAdvisory {
  advisory_id: string;
  risk_class: 'nominal' | 'elevated' | 'watch' | 'unreachable';
  notes: string[];
  judge?: string;
}

export async function advisePayment(surface: string, actor: any, payload: any): Promise<LumosAdvisory> {
  const lumosUrl = process.env.LUMOS_URL;
  const lumosToken = process.env.LUMOS_TOKEN;
  const trace_id = crypto.randomUUID();

  if (!lumosUrl) {
    return {
      advisory_id: `lumos-unreachable-${trace_id}`,
      risk_class: 'unreachable',
      notes: ['Lumos URL not configured']
    };
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 250); // 250ms per schematic

    const response = await fetch(lumosUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Lumos-Token': lumosToken || '',
        'X-Trace-Id': trace_id
      },
      body: JSON.stringify({
        surface,
        actor,
        payload,
        trace_id
      }),
      signal: controller.signal
    });

    clearTimeout(timeout);

    if (response.ok) {
      return await response.json();
    } else {
      logger.warn(`Lumos returned non-200: ${response.status}`);
      return {
        advisory_id: `lumos-unreachable-${trace_id}`,
        risk_class: 'unreachable',
        notes: [`Lumos returned status ${response.status}`]
      };
    }
  } catch (error: any) {
    logger.warn(`Lumos advisory failed: ${error.message}`);
    return {
      advisory_id: `lumos-unreachable-${trace_id}`,
      risk_class: 'unreachable',
      notes: [error.message]
    };
  }
}
