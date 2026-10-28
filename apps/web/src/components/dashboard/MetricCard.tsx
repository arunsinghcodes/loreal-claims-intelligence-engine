import React from "react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";

export interface MetricCardProps {
  icon: React.ReactNode;
  iconVariant?: "dark" | "green" | "amber" | "red";
  period: string;
  value: number | string;
  label: string;
  footerText: string;
  footerHighlight?: boolean;
  arrowDirection?: "up" | "down";
  arrowColor?: "default" | "green" | "amber" | "red";
  onClick?: () => void;
}

export function MetricCard({
  icon,
  iconVariant = "dark",
  period,
  value,
  label,
  footerText,
  footerHighlight = false,
  arrowDirection = "up",
  arrowColor = "default",
  onClick,
}: MetricCardProps) {
  const ArrowIcon = arrowDirection === "up" ? ArrowUpRight : ArrowDownRight;

  const arrowClass =
    arrowColor === "green"
      ? "metric-arrow green-text"
      : arrowColor === "amber"
        ? "metric-arrow amber-text"
        : arrowColor === "red"
          ? "metric-arrow red-text"
          : "metric-arrow";

  return (
    <button className="metric-card" onClick={onClick}>
      <div className="metric-top">
        <span className={`metric-icon icon-${iconVariant}`}>{icon}</span>
        <span className="metric-period">{period}</span>
      </div>
      <div className="metric-value">{value}</div>
      <div className="metric-label">{label}</div>
      <div className="metric-foot">
        <span className={footerHighlight ? "metric-good" : "metric-muted"}>
          {footerText}
        </span>
        <ArrowIcon size={16} className={arrowClass} />
      </div>
    </button>
  );
}

