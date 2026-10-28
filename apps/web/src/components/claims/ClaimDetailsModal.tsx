import { FileCheck2, ShieldCheck, X } from "lucide-react";
import type { ClaimDetailResponse } from "../../api/claims";
import type { UIClaim } from "../../types/claims";
import { IconButton } from "../ui/IconButton";
import { StatusBadge, VerdictBadge } from "../ui/StatusBadge";

export interface ClaimDetailsModalProps {
  claim: UIClaim | null;
  details: ClaimDetailResponse | null;
  isLoading: boolean;
  error: string | null;
  onClose: () => void;
  onRetry: () => void;
}

export function ClaimDetailsModal({
  claim,
  details,
  isLoading,
  error,
  onClose,
  onRetry,
}: ClaimDetailsModalProps) {
  if (!claim) return null;

  return (
    <div
      className="modal-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        className="modal detail-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="detail-title"
      >
        <div className="modal-header">
          <div>
            <span className="eyebrow">
              <FileCheck2 size={13} /> CLAIM DETAILS
            </span>
            <h2 id="detail-title">{claim.product}</h2>
            <p>
              {claim.id} · Submitted {claim.date}
            </p>
          </div>
          <IconButton onClick={onClose} aria-label="Close">
            <X size={19} />
          </IconButton>
        </div>
        <div className="detail-body">
          <span className="detail-label">MARKETING CLAIM</span>
          <p className="detail-claim">{claim.claim}</p>
          <div className="detail-grid">
            <div>
              <span className="detail-label">ASSESSMENT</span>
              <VerdictBadge verdict={claim.verdict} />
            </div>
            <div>
              <span className="detail-label">STATUS</span>
              <StatusBadge status={claim.status} />
            </div>
            <div>
              <span className="detail-label">MODEL CONFIDENCE</span>
              <strong className="detail-confidence">
                {claim.confidence === null ? "—" : `${claim.confidence}%`}
              </strong>
            </div>
          </div>

          {isLoading && (
            <div className="detail-notice" role="status">
              Loading assessment details...
            </div>
          )}

          {error && (
            <div className="detail-notice" role="alert">
              <p>{error}</p>
              <button className="secondary-button" onClick={onRetry}>
                Retry
              </button>
            </div>
          )}

          {!isLoading && !error && details && (
            <>
              {details.assessments[0] && (
                <>
                  <div className="assessment-detail-section">
                    <span className="detail-label">AI REASONING</span>
                    <p className="detail-claim">
                      {details.assessments[0].reasoning ||
                        "No reasoning was returned for this assessment."}
                    </p>
                  </div>

                  <div className="assessment-detail-section">
                    <span className="detail-label">SCIENTIFIC EVIDENCE</span>
                    <p className="detail-claim evidence-text">
                      {details.assessments[0].evidence}
                    </p>
                  </div>

                  <div className="assessment-detail-section">
                    <span className="detail-label">EVIDENCE LIMITATIONS</span>

                    {details.assessments[0].limitations.length > 0 ? (
                      <ul className="limitations-list">
                        {details.assessments[0].limitations.map(
                          (limitation, index) => (
                            <li key={`${index}-${limitation}`}>{limitation}</li>
                          ),
                        )}
                      </ul>
                    ) : (
                      <p className="detail-claim">
                        No limitations were returned.
                      </p>
                    )}
                  </div>

                  <div className="detail-notice">
                    <ShieldCheck size={17} />
                    <p>
                      AI-generated analysis is decision support only. Scientific
                      and regulatory approval requires qualified human review.
                    </p>
                  </div>
                </>
              )}
            </>
          )}
        </div>
        <div className="modal-actions">
          <button className="secondary-button" onClick={onClose}>
            Close
          </button>
        </div>
      </section>
    </div>
  );
}

