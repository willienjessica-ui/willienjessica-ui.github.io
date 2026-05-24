export interface MatchScore {
  jobId: string;
  score: number; // 0-100
  reasoning: string;
}

export interface MatchingRequest {
  providerId: string;
}

export interface MatchingResponse {
  matches: MatchScore[];
}
