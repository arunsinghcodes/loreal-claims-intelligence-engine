import { Activity, ShieldCheck } from "lucide-react";

export interface AssessmentDistributionProps {
  completedCount: number;
  justifiedCount: number;
  inconclusiveCount: number;
  notJustifiedCount: number;
}

export function AssessmentDistribution({
  completedCount,
  justifiedCount,
  inconclusiveCount,
  notJustifiedCount,
}: AssessmentDistributionProps) {
  const justifiedPct = completedCount
    ? (justifiedCount / completedCount) * 100
    : 0;
  const midPct = completedCount
    ? ((justifiedCount + inconclusiveCount) / completedCount) * 100
    : 0;

  return (
    <div className="panel distribution-panel">
      <div className="panel-heading">
        <div>
          <h3>Assessment distribution</h3>
          <p>Overview of completed assessments</p>
        </div>
        <span className="subtle-icon">
          <Activity size={17} />
        </span>
      </div>
      <div className="distribution-content">
        <div
          className="donut-chart"
          style={{
            background: `conic-gradient(
              #18865c 0% ${justifiedPct}%,
              #d99a2b ${justifiedPct}% ${midPct}%,
              #d94c50 ${midPct}% 100%
            )`,
          }}
        >
          <div className="donut-inner">
            <strong>{completedCount}</strong>
            <span>Completed</span>
          </div>
        </div>
        <div className="legend-list">
          <div className="legend-item">
            <span className="legend-dot dot-green" />
            <span>Justified</span>
            <strong>{justifiedCount}</strong>
          </div>
          <div className="legend-item">
            <span className="legend-dot dot-amber" />
            <span>Inconclusive</span>
            <strong>{inconclusiveCount}</strong>
          </div>
          <div className="legend-item">
            <span className="legend-dot dot-red" />
            <span>Not justified</span>
            <strong>{notJustifiedCount}</strong>
          </div>
        </div>
      </div>
      <div className="panel-footnote">
        <ShieldCheck size={14} />
        AI outputs support review; they are not regulatory approval.
      </div>
    </div>
  );
}

