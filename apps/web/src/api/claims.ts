import { apiRequest } from "./client";
import type { Claim, ClaimAssessment, ClaimsResponse } from "../types/claims";

export interface GetClaimsParams {
  page?: number;
  limit?: number;
  search?: string;
  verdict?: string;
}

export interface AssessClaimPayload {
  productName: string;
  claim: string;
  evidence: string;
  submittedBy: string;
}

export interface AssessClaimResponse {
  claimId: string;
  assessmentId: string;
  status: "PENDING" | "COMPLETED" | "FAILED";
  verdict: "JUSTIFIED" | "NOT_JUSTIFIED" | "INCONCLUSIVE" | null;
  confidenceScore: number | null;
  reasoning?: string;
  limitations?: string[];
  message: string;
}

export interface ClaimAssessmentDetail extends ClaimAssessment {
  claimId: string;
  evidence: string;
  reasoning: string | null;
  limitations: string[];
  model: string | null;
  promptVersion: string | null;
}

export interface ClaimDetailResponse extends Omit<Claim, "assessments"> {
  assessments: ClaimAssessmentDetail[];
}

export function getClaims({
  page = 1,
  limit = 10,
  search,
  verdict,
}: GetClaimsParams = {}): Promise<ClaimsResponse> {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  if (search?.trim()) params.set('search', search.trim());
  if (verdict && verdict !== 'ALL') params.set('verdict', verdict);

  return apiRequest<ClaimsResponse>(`/claims?${params}`);
}

export function assessClaim(
  payload: AssessClaimPayload,
): Promise<AssessClaimResponse> {
  return apiRequest<AssessClaimResponse>("/claims/assess", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function getClaimById(id: string): Promise<ClaimDetailResponse> {
  return apiRequest<ClaimDetailResponse>(`/claims/${encodeURIComponent(id)}`);
}
