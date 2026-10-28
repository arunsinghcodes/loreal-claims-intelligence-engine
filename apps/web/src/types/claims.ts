export type ClaimVerdict = "JUSTIFIED" | "NOT_JUSTIFIED" | "INCONCLUSIVE";

export type AssessmentStatus = "PENDING" | "COMPLETED" | "FAILED";

export interface ClaimAssessment {
  id: string;
  status: AssessmentStatus;
  verdict: ClaimVerdict | null;
  confidenceScore: number | null;
  createdAt: string;
  completedAt: string | null;
}

export interface Claim {
  id: string;
  productName: string | null;
  description: string;
  submittedBy: string | null;
  createdAt: string;
  updatedAt: string;
  assessments: ClaimAssessment[];
}

export interface ClaimsPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ClaimsResponse {
  data: Claim[];
  pagination: ClaimsPagination;
}
