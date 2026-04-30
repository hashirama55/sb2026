export interface AnalysisResponse {
  is_scam: boolean;
  risk_score: number;
  category: string;
  red_flags: string[];
  recommendation: string;
  summary: string;
}
