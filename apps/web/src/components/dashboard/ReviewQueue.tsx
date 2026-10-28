import { ArrowRight, Clock3, FileCheck2 } from "lucide-react";

export interface ReviewQueueProps {
  pendingCount: number;
  onViewQueue: () => void;
}

export function ReviewQueue({ pendingCount, onViewQueue }: ReviewQueueProps) {
  return (
    <div className="panel activity-panel">
      <div className="panel-heading">
        <div>
          <h3>Review queue</h3>
          <p>Claims that need attention</p>
        </div>
        <button className="text-button" onClick={onViewQueue}>
          View queue <ArrowRight size={14} />
        </button>
      </div>
      <div className="queue-stat">
        <div className="queue-stat-icon">
          <Clock3 size={20} />
        </div>
        <div>
          <strong>{pendingCount}</strong>
          <span>Pending assessment{pendingCount === 1 ? "" : "s"}</span>
        </div>
      </div>
      <div className="queue-divider" />
      <div className="queue-note">
        <div className="queue-note-icon">
          <FileCheck2 size={17} />
        </div>
        <p>
          <strong>Human review matters</strong>
          <span>
            Validate study design, results and limitations before approving
            claims.
          </span>
        </p>
      </div>
    </div>
  );
}

