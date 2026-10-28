import type { AssessmentStatus, ClaimVerdict } from "../../types/claims";

export function VerdictBadge({ verdict }: { verdict: ClaimVerdict | null }) {
  if (!verdict) {
    return <span className="badge badge-neutral">Not assessed</span>;
  }

  const labels: Record<ClaimVerdict, string> = {
    JUSTIFIED: "Justified",
    NOT_JUSTIFIED: "Not justified",
    INCONCLUSIVE: "Inconclusive",
  };

  return (
    <span className={`badge badge-${verdict.toLowerCase()}`}>
      <span className="badge-dot" />
      {labels[verdict]}
    </span>
  );
}

export function StatusBadge({ status }: { status: AssessmentStatus }) {
  return (
    <span className={`status status-${status.toLowerCase()}`}>
      <span className="status-dot" />
      {status === "COMPLETED"
        ? "Completed"
        : status === "PENDING"
          ? "Pending"
          : "Failed"}
    </span>
  );
}

