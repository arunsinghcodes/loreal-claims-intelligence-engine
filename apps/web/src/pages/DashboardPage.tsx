import { useMemo } from "react";
import {
  CheckCircle2,
  Clock3,
  FileText,
  Plus,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import type { UIClaim } from "../types/claims";
import { WelcomeBanner } from "../components/dashboard/WelcomeBanner";
import { MetricCard } from "../components/dashboard/MetricCard";
import { AssessmentDistribution } from "../components/dashboard/AssessmentDistribution";
import { ReviewQueue } from "../components/dashboard/ReviewQueue";
import { RecentClaimsTable } from "../components/dashboard/RecentClaimsTable";

export interface DashboardPageProps {
  activeNav: string;
  onSelectNav: (nav: string) => void;
  claims: UIClaim[];
  isLoading: boolean;
  apiError: string | null;
  onRetryLoad: () => void;
  search: string;
  onSearchChange: (search: string) => void;
  verdictFilter: string;
  onVerdictFilterChange: (filter: string) => void;
  onNewAssessment: () => void;
  onSelectClaim: (claim: UIClaim) => void;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function DashboardPage({
  activeNav,
  onSelectNav,
  claims,
  isLoading,
  apiError,
  onRetryLoad,
  search,
  onSearchChange,
  verdictFilter,
  onVerdictFilterChange,
  onNewAssessment,
  onSelectClaim,
  page,
  totalPages,
  onPageChange,
}: DashboardPageProps) {
  const completed = claims.filter((claim) => claim.status === "COMPLETED");
  const justified = completed.filter(
    (claim) => claim.verdict === "JUSTIFIED",
  ).length;
  const inconclusive = completed.filter(
    (claim) => claim.verdict === "INCONCLUSIVE",
  ).length;
  const notJustified = completed.filter(
    (claim) => claim.verdict === "NOT_JUSTIFIED",
  ).length;
  const pending = claims.filter((claim) => claim.status === "PENDING").length;

  const filteredClaims = useMemo(() => {
    const query = search.trim().toLowerCase();

    return claims.filter((claim) => {
      const matchesSearch =
        !query ||
        claim.product.toLowerCase().includes(query) ||
        claim.claim.toLowerCase().includes(query) ||
        claim.id.toLowerCase().includes(query);

      const matchesVerdict =
        verdictFilter === "ALL" ||
        (verdictFilter === "PENDING"
          ? claim.status === "PENDING"
          : claim.verdict === verdictFilter);

      const matchesSection =
        activeNav !== "Assessments" || claim.status === "COMPLETED";

      return matchesSearch && matchesVerdict && matchesSection;
    });
  }, [claims, search, verdictFilter, activeNav]);

  return (
    <div className="page-content">
      {apiError && (
        <div role="alert" className="api-error">
          {apiError}
          <button onClick={onRetryLoad}>Retry</button>
        </div>
      )}

      {isLoading && (
        <p role="status" className="api-loading">
          Loading claims from the server...
        </p>
      )}

      <section className="page-heading">
        <div>
          <div className="eyebrow">
            <Sparkles size={14} /> SCIENCE-LED. EVIDENCE-FIRST.
          </div>
          <h1>
            {activeNav === "Assessments"
              ? "Assessments"
              : activeNav === "Claims library"
                ? "Claims library"
                : "Claims overview"}
          </h1>
          <p>
            Evaluate product claims against scientific evidence with AI-assisted
            analysis.
          </p>
        </div>
        <button className="primary-button" onClick={onNewAssessment}>
          <Plus size={17} /> New assessment
        </button>
      </section>

      <WelcomeBanner onNewAssessment={onNewAssessment} />

      <section className="metrics-grid" aria-label="Claims metrics">
        <MetricCard
          icon={<FileText size={19} />}
          iconVariant="dark"
          period="All records"
          value={claims.length}
          label="Total claims"
          footerText="Across all products"
          arrowDirection="up"
          arrowColor="default"
          onClick={() => onVerdictFilterChange("ALL")}
        />

        <MetricCard
          icon={<CheckCircle2 size={19} />}
          iconVariant="green"
          period="Evidence supports"
          value={justified}
          label="Justified claims"
          footerText="Ready for human review"
          footerHighlight
          arrowDirection="up"
          arrowColor="green"
          onClick={() => onVerdictFilterChange("JUSTIFIED")}
        />

        <MetricCard
          icon={<Clock3 size={19} />}
          iconVariant="amber"
          period="More evidence"
          value={inconclusive}
          label="Inconclusive"
          footerText="Requires further review"
          arrowDirection="down"
          arrowColor="amber"
          onClick={() => onVerdictFilterChange("INCONCLUSIVE")}
        />

        <MetricCard
          icon={<ShieldCheck size={19} />}
          iconVariant="red"
          period="Not supported"
          value={notJustified}
          label="Not justified"
          footerText="Evidence gap identified"
          arrowDirection="down"
          arrowColor="red"
          onClick={() => onVerdictFilterChange("NOT_JUSTIFIED")}
        />
      </section>

      <section className="insights-grid">
        <AssessmentDistribution
          completedCount={completed.length}
          justifiedCount={justified}
          inconclusiveCount={inconclusive}
          notJustifiedCount={notJustified}
        />

        <ReviewQueue
          pendingCount={pending}
          onViewQueue={() => {
            onVerdictFilterChange("PENDING");
            onSelectNav("Claims library");
          }}
        />
      </section>

      <RecentClaimsTable
        claims={filteredClaims}
        totalClaimsCount={claims.length}
        search={search}
        onSearchChange={onSearchChange}
        verdictFilter={verdictFilter}
        onVerdictFilterChange={onVerdictFilterChange}
        onSelectClaim={onSelectClaim}
        onViewAllClaims={() => {
          onSelectNav("Claims library");
          onVerdictFilterChange("ALL");
        }}
        page={page}
        totalPages={totalPages}
        onPageChange={onPageChange}
        isLoading={isLoading}
      />

      <footer className="page-footer">
        <span>© 2026 L'Oréal Claims Intelligence Engine · Prototype</span>
        <span>
          <ShieldCheck size={14} /> Human review required for scientific
          decisions
        </span>
      </footer>
    </div>
  );
}

