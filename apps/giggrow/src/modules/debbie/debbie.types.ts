export type DebbieMode =
  | 'general'
  | 'dispatch'
  | 'operators'
  | 'intel'
  | 'govbid'
  | 'contracts'
  | 'jobs';

export interface DebbieMemoryItem {
  role: 'user' | 'model' | 'system';
  content: string;
  timestamp?: string;
}

export interface DebbieChatRequest {
  message: string;
  mode?: DebbieMode;
  memory?: DebbieMemoryItem[];
  metadata?: {
    userId?: string;
    contractorId?: string;
    companyName?: string;
    location?: string;
    membershipTier?: string;
    activeTab?: string;
  };
}

export interface DebbieChatResponse {
  ok: boolean;
  mode: DebbieMode;
  reply: string;
  timestamp: string;
  debug?: {
    model: string;
    usedMemoryCount: number;
  };
}
