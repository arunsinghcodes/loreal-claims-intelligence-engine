export type ClaimVerdict = "JUSTIFIED" | "NOT_JUSTIFIED" | "INCONCLUSIVE";
export type Verdict = ClaimVerdict;

export type AssessmentStatus = "PENDING" | "COMPLETED" | "FAILED";
export type Status = AssessmentStatus;

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

export interface UIClaim {
  id: string;
  product: string;
  claim: string;
  date: string;
  verdict: ClaimVerdict | null;
  status: AssessmentStatus;
  confidence: number | null;
  submittedBy: string;
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

export function mapApiClaim(apiClaim: Claim): UIClaim {
  const assessment = apiClaim.assessments[0];

  return {
    id: apiClaim.id,
    product: apiClaim.productName ?? "Unnamed product",
    claim: apiClaim.description,
    date: new Date(apiClaim.createdAt).toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    }),
    verdict: (assessment?.verdict ?? null) as ClaimVerdict | null,
    status: (assessment?.status ?? "PENDING") as AssessmentStatus,
    confidence: assessment?.confidenceScore ?? null,
    submittedBy: apiClaim.submittedBy ?? "Unknown",
  };
}
