import { useMemo, useState, useEffect } from "react";
import {
  Activity,
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  Bell,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleHelp,
  Clock3,
  FileCheck2,
  FileText,
  FlaskConical,
  LayoutDashboard,
  Menu,
  Plus,
  Search,
  Settings2,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  X,
} from "lucide-react";
import "./App.css";
import {
  assessClaim,
  getClaims,
  getClaimById,
  type ClaimDetailResponse,
} from "./api/claims";
import type {
  Claim as ApiClaim,
  ClaimVerdict,
  AssessmentStatus,
} from "./types/claims";

type Verdict = "JUSTIFIED" | "NOT_JUSTIFIED" | "INCONCLUSIVE";
type Status = "COMPLETED" | "PENDING" | "FAILED";

type Claim = {
  id: string;
  product: string;
  claim: string;
  date: string;
  verdict: Verdict | null;
  status: Status;
  confidence: number | null;
  submittedBy: string;
};

// const initialClaims: Claim[] = [
//   {
//     id: "CLM-2026-1042",
//     product: "Revitalift Clinical",
//     claim: "Reduces the appearance of wrinkles in 4 weeks",
//     date: "Oct 27, 2026",
//     verdict: "JUSTIFIED",
//     status: "COMPLETED",
//     confidence: 94,
//     submittedBy: "Research Team",
//   },
//   {
//     id: "CLM-2026-1041",
//     product: "UV Defender SPF 50+",
//     claim: "Provides broad-spectrum UV protection",
//     date: "Oct 27, 2026",
//     verdict: "INCONCLUSIVE",
//     status: "COMPLETED",
//     confidence: 95,
//     submittedBy: "Clinical Research",
//   },
//   {
//     id: "CLM-2026-1040",
//     product: "Glycolic Bright",
//     claim: "Visibly improves skin radiance in 7 days",
//     date: "Oct 26, 2026",
//     verdict: "NOT_JUSTIFIED",
//     status: "COMPLETED",
//     confidence: 88,
//     submittedBy: "Product Innovation",
//   },
//   {
//     id: "CLM-2026-1039",
//     product: "Hydra Genius",
//     claim: "Provides 72-hour skin hydration",
//     date: "Oct 26, 2026",
//     verdict: null,
//     status: "PENDING",
//     confidence: null,
//     submittedBy: "Research Team",
//   },
//   {
//     id: "CLM-2026-1038",
//     product: "Elseve Hyaluron",
//     claim: "Improves hair hydration after one use",
//     date: "Oct 25, 2026",
//     verdict: "JUSTIFIED",
//     status: "COMPLETED",
//     confidence: 91,
//     submittedBy: "Haircare Science",
//   },
// ];

const navItems = [
  { label: "Overview", icon: LayoutDashboard },
  { label: "Claims library", icon: FileText },
  { label: "Assessments", icon: FlaskConical },
];

function VerdictBadge({ verdict }: { verdict: Verdict | null }) {
  if (!verdict) {
    return <span className="badge badge-neutral">Not assessed</span>;
  }

  const labels: Record<Verdict, string> = {
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

function StatusBadge({ status }: { status: Status }) {
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

function mapApiClaim(apiClaim: ApiClaim): Claim {
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

function App() {
  const [claims, setClaims] = useState<Claim[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [apiPage, setApiPage] = useState(1);
  const [apiTotalPages, setApiTotalPages] = useState(1);
  const [activeNav, setActiveNav] = useState("Overview");
  const [search, setSearch] = useState("");
  const [verdictFilter, setVerdictFilter] = useState("ALL");
  const [showForm, setShowForm] = useState(false);
  const [selectedClaim, setSelectedClaim] = useState<Claim | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [form, setForm] = useState({
    productName: "",
    claim: "",
    evidence: "",
    submittedBy: "Research Team",
  });

  const [claimDetails, setClaimDetails] = useState<ClaimDetailResponse | null>(
    null,
  );

  const [detailsLoading, setDetailsLoading] = useState(false);
  const [detailsError, setDetailsError] = useState<string | null>(null);

  async function loadClaims(page = apiPage) {
    setIsLoading(true);
    setApiError(null);

    try {
      const response = await getClaims({ page, limit: 10 });

      setClaims(response.data.map(mapApiClaim));
      setApiPage(response.pagination.page);
      setApiTotalPages(response.pagination.totalPages);
    } catch (error) {
      setApiError(
        error instanceof Error
          ? error.message
          : "Unable to load claims from the server.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    void loadClaims(1);
  }, []);

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

  function updateForm(field: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isSubmitting) return;

    setIsSubmitting(true);
    setApiError(null);

    try {
      await assessClaim({
        productName: form.productName.trim(),
        claim: form.claim.trim(),
        evidence: form.evidence.trim(),
        submittedBy: form.submittedBy.trim() || "Research Team",
      });

      setForm({
        productName: "",
        claim: "",
        evidence: "",
        submittedBy: "Research Team",
      });

      setShowForm(false);
      setActiveNav("Overview");
      setVerdictFilter("ALL");
      setSearch("");

      await loadClaims(1);
    } catch (error) {
      setApiError(
        error instanceof Error
          ? error.message
          : "Assessment failed. Please check the server and try again.",
      );

      // The backend may save the claim even if AI assessment fails.
      await loadClaims(1);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function openClaimDetails(claim: Claim) {
    setSelectedClaim(claim);
    setClaimDetails(null);
    setDetailsError(null);
    setDetailsLoading(true);

    try {
      const details = await getClaimById(claim.id);
      setClaimDetails(details);
    } catch (error) {
      setDetailsError(
        error instanceof Error
          ? error.message
          : "Unable to load assessment details.",
      );
    } finally {
      setDetailsLoading(false);
    }
  }

  return (
    <div className="app-shell">
      {mobileMenuOpen && (
        <button
          className="mobile-overlay"
          aria-label="Close navigation"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      <aside className={`sidebar ${mobileMenuOpen ? "sidebar-open" : ""}`}>
        <div className="brand">
          <div className="brand-mark">
            <FlaskConical size={21} strokeWidth={1.8} />
          </div>
          <div>
            <div className="brand-name">L'ORÉAL</div>
            <div className="brand-subtitle">CLAIMS INTELLIGENCE</div>
          </div>
          <button
            className="icon-button sidebar-close"
            aria-label="Close menu"
            onClick={() => setMobileMenuOpen(false)}
          >
            <X size={18} />
          </button>
        </div>

        <div className="workspace-label">WORKSPACE</div>
        <button className="workspace-switcher">
          <span className="workspace-avatar">R</span>
          <span className="workspace-copy">
            <strong>Research & Science</strong>
            <small>India workspace</small>
          </span>
          <ChevronDown size={15} />
        </button>

        <div className="nav-label">PLATFORM</div>
        <nav className="nav-list">
          {navItems.map(({ label, icon: Icon }) => (
            <button
              key={label}
              className={`nav-item ${activeNav === label ? "nav-item-active" : ""}`}
              onClick={() => {
                setActiveNav(label);
                setMobileMenuOpen(false);
                setVerdictFilter("ALL");
              }}
            >
              <Icon size={18} strokeWidth={1.8} />
              <span>{label}</span>
              {label === "Claims library" && (
                <span className="nav-count">{claims.length}</span>
              )}
            </button>
          ))}
        </nav>

        <div className="nav-label tools-label">TOOLS</div>
        <button className="nav-item" onClick={() => setShowForm(true)}>
          <Plus size={18} />
          <span>New assessment</span>
        </button>
        <button
          className="nav-item"
          onClick={() =>
            window.alert("Settings will be added in a later milestone.")
          }
        >
          <Settings2 size={18} />
          <span>Settings</span>
        </button>

        <div className="sidebar-bottom">
          <div className="help-card">
            <div className="help-icon">
              <CircleHelp size={18} />
            </div>
            <strong>Need a hand?</strong>
            <p>Learn how to review scientific claims and evidence.</p>
            <button
              onClick={() => window.alert("Documentation will be added soon.")}
            >
              Explore documentation <ArrowRight size={14} />
            </button>
          </div>

          <div className="profile">
            <div className="profile-avatar">AS</div>
            <div className="profile-copy">
              <strong>Research Scientist</strong>
              <small>Research & Science</small>
            </div>
            <ChevronDown size={15} />
          </div>
        </div>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <div className="breadcrumbs">
            <button
              className="icon-button mobile-menu-button"
              aria-label="Open navigation"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu size={20} />
            </button>
            <span>Claims Intelligence</span>
            <ChevronRight size={15} />
            <strong>{activeNav}</strong>
          </div>
          <div className="topbar-actions">
            <span className="environment-pill">
              <span />
              Development
            </span>
            <button
              className="icon-button notification-button"
              aria-label="Notifications"
              onClick={() => window.alert("No new notifications.")}
            >
              <Bell size={18} />
              <i />
            </button>
            <div className="topbar-divider" />
            <div className="topbar-avatar">AS</div>
          </div>
        </header>

        <div className="page-content">
          {apiError && (
            <div role="alert" className="api-error">
              {apiError}
              <button onClick={() => void loadClaims(1)}>Retry</button>
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
                Evaluate product claims against scientific evidence with
                AI-assisted analysis.
              </p>
            </div>
            <button
              className="primary-button"
              onClick={() => setShowForm(true)}
            >
              <Plus size={17} /> New assessment
            </button>
          </section>

          <section className="welcome-banner">
            <div className="welcome-content">
              <div className="welcome-kicker">
                <ShieldCheck size={15} /> CLAIMS ASSURANCE WORKSPACE
              </div>
              <h2>Evidence that earns confidence.</h2>
              <p>
                Bring scientific evidence and product claims together. Get
                structured AI-assisted insights to support informed human
                review.
              </p>
              <button
                className="banner-button"
                onClick={() => setShowForm(true)}
              >
                Assess a new claim <ArrowRight size={15} />
              </button>
            </div>
            <div className="banner-art" aria-hidden="true">
              <div className="art-orbit orbit-one" />
              <div className="art-orbit orbit-two" />
              <div className="art-orbit orbit-three" />
              <div className="art-core">
                <FlaskConical size={42} strokeWidth={1.2} />
              </div>
              <div className="art-chip chip-top">
                <CheckCircle2 size={16} /> Evidence
              </div>
              <div className="art-chip chip-bottom">
                <Activity size={16} /> AI analysis
              </div>
            </div>
          </section>

          <section className="metrics-grid" aria-label="Claims metrics">
            <button
              className="metric-card"
              onClick={() => setVerdictFilter("ALL")}
            >
              <div className="metric-top">
                <span className="metric-icon icon-dark">
                  <FileText size={19} />
                </span>
                <span className="metric-period">All records</span>
              </div>
              <div className="metric-value">{claims.length}</div>
              <div className="metric-label">Total claims</div>
              <div className="metric-foot">
                <span className="metric-muted">Across all products</span>
                <ArrowUpRight size={16} className="metric-arrow" />
              </div>
            </button>

            <button
              className="metric-card"
              onClick={() => setVerdictFilter("JUSTIFIED")}
            >
              <div className="metric-top">
                <span className="metric-icon icon-green">
                  <CheckCircle2 size={19} />
                </span>
                <span className="metric-period">Evidence supports</span>
              </div>
              <div className="metric-value">{justified}</div>
              <div className="metric-label">Justified claims</div>
              <div className="metric-foot">
                <span className="metric-good">Ready for human review</span>
                <ArrowUpRight size={16} className="metric-arrow green-text" />
              </div>
            </button>

            <button
              className="metric-card"
              onClick={() => setVerdictFilter("INCONCLUSIVE")}
            >
              <div className="metric-top">
                <span className="metric-icon icon-amber">
                  <Clock3 size={19} />
                </span>
                <span className="metric-period">More evidence</span>
              </div>
              <div className="metric-value">{inconclusive}</div>
              <div className="metric-label">Inconclusive</div>
              <div className="metric-foot">
                <span className="metric-muted">Requires further review</span>
                <ArrowDownRight size={16} className="metric-arrow amber-text" />
              </div>
            </button>

            <button
              className="metric-card"
              onClick={() => setVerdictFilter("NOT_JUSTIFIED")}
            >
              <div className="metric-top">
                <span className="metric-icon icon-red">
                  <ShieldCheck size={19} />
                </span>
                <span className="metric-period">Not supported</span>
              </div>
              <div className="metric-value">{notJustified}</div>
              <div className="metric-label">Not justified</div>
              <div className="metric-foot">
                <span className="metric-muted">Evidence gap identified</span>
                <ArrowDownRight size={16} className="metric-arrow red-text" />
              </div>
            </button>
          </section>

          <section className="insights-grid">
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
                      #18865c 0% ${completed.length ? (justified / completed.length) * 100 : 0}%,
                      #d99a2b ${completed.length ? (justified / completed.length) * 100 : 0}% ${completed.length ? ((justified + inconclusive) / completed.length) * 100 : 0}%,
                      #d94c50 ${completed.length ? ((justified + inconclusive) / completed.length) * 100 : 0}% 100%
                    )`,
                  }}
                >
                  <div className="donut-inner">
                    <strong>{completed.length}</strong>
                    <span>Completed</span>
                  </div>
                </div>
                <div className="legend-list">
                  <div className="legend-item">
                    <span className="legend-dot dot-green" />
                    <span>Justified</span>
                    <strong>{justified}</strong>
                  </div>
                  <div className="legend-item">
                    <span className="legend-dot dot-amber" />
                    <span>Inconclusive</span>
                    <strong>{inconclusive}</strong>
                  </div>
                  <div className="legend-item">
                    <span className="legend-dot dot-red" />
                    <span>Not justified</span>
                    <strong>{notJustified}</strong>
                  </div>
                </div>
              </div>
              <div className="panel-footnote">
                <ShieldCheck size={14} />
                AI outputs support review; they are not regulatory approval.
              </div>
            </div>

            <div className="panel activity-panel">
              <div className="panel-heading">
                <div>
                  <h3>Review queue</h3>
                  <p>Claims that need attention</p>
                </div>
                <button
                  className="text-button"
                  onClick={() => {
                    setVerdictFilter("PENDING");
                    setActiveNav("Claims library");
                  }}
                >
                  View queue <ArrowRight size={14} />
                </button>
              </div>
              <div className="queue-stat">
                <div className="queue-stat-icon">
                  <Clock3 size={20} />
                </div>
                <div>
                  <strong>{pending}</strong>
                  <span>Pending assessment{pending === 1 ? "" : "s"}</span>
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
                    Validate study design, results and limitations before
                    approving claims.
                  </span>
                </p>
              </div>
            </div>
          </section>

          <section className="panel claims-panel">
            <div className="claims-heading">
              <div>
                <h3>Recent claims</h3>
                <p>Browse and review submitted product claims</p>
              </div>
              <button
                className="secondary-button"
                onClick={() => {
                  setActiveNav("Claims library");
                  setVerdictFilter("ALL");
                }}
              >
                View all claims <ArrowRight size={15} />
              </button>
            </div>

            <div className="table-toolbar">
              <label className="search-box">
                <Search size={17} />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search product, claim or ID..."
                />
                {search && (
                  <button
                    className="search-clear"
                    onClick={() => setSearch("")}
                    aria-label="Clear search"
                  >
                    <X size={14} />
                  </button>
                )}
              </label>
              <label className="filter-select">
                <SlidersHorizontal size={15} />
                <select
                  value={verdictFilter}
                  onChange={(event) => setVerdictFilter(event.target.value)}
                  aria-label="Filter by assessment verdict"
                >
                  <option value="ALL">All verdicts</option>
                  <option value="JUSTIFIED">Justified</option>
                  <option value="NOT_JUSTIFIED">Not justified</option>
                  <option value="INCONCLUSIVE">Inconclusive</option>
                  <option value="PENDING">Pending</option>
                </select>
                <ChevronDown size={14} />
              </label>
            </div>

            <div className="table-scroll">
              <table className="claims-table">
                <thead>
                  <tr>
                    <th>PRODUCT / CLAIM</th>
                    <th>SUBMITTED</th>
                    <th>ASSESSMENT</th>
                    <th>CONFIDENCE</th>
                    <th>STATUS</th>
                    <th aria-label="Actions" />
                  </tr>
                </thead>
                <tbody>
                  {filteredClaims.map((claim) => (
                    <tr key={claim.id}>
                      <td>
                        <button
                          className="claim-title-button"
                          onClick={() => void openClaimDetails(claim)}
                        >
                          <span className="product-symbol">
                            <FlaskConical size={17} />
                          </span>
                          <span className="claim-copy">
                            <strong>{claim.product}</strong>
                            <span>{claim.claim}</span>
                            <small>{claim.id}</small>
                          </span>
                        </button>
                      </td>
                      <td>
                        <div className="submitted-date">{claim.date}</div>
                        <div className="submitted-by">{claim.submittedBy}</div>
                      </td>
                      <td>
                        <VerdictBadge verdict={claim.verdict} />
                      </td>
                      <td>
                        {claim.confidence !== null ? (
                          <div className="confidence-cell">
                            <strong>{claim.confidence}%</strong>
                            <span className="confidence-track">
                              <span style={{ width: `${claim.confidence}%` }} />
                            </span>
                          </div>
                        ) : (
                          <span className="muted-dash">—</span>
                        )}
                      </td>
                      <td>
                        <StatusBadge status={claim.status} />
                      </td>
                      <td>
                        <button
                          className="row-action"
                          aria-label={`View ${claim.product}`}
                          onClick={() => void openClaimDetails(claim)}
                        >
                          <ArrowRight size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredClaims.length === 0 && (
                <div className="empty-state">
                  <Search size={24} />
                  <strong>No matching claims</strong>
                  <span>Try changing the search or filter.</span>
                  <button
                    className="text-button"
                    onClick={() => {
                      setSearch("");
                      setVerdictFilter("ALL");
                    }}
                  >
                    Clear filters
                  </button>
                </div>
              )}
            </div>

            <div className="table-footer">
              <span>
                Showing <strong>{filteredClaims.length}</strong> of{" "}
                <strong>{claims.length}</strong> claims
              </span>

              <div className="pagination-controls">
                <button
                  disabled={isLoading || apiPage <= 1}
                  aria-label="Previous page"
                  onClick={() => void loadClaims(apiPage - 1)}
                >
                  <ChevronLeft size={16} />
                </button>

                <button
                  className="page-number"
                  disabled
                  aria-label={`Page ${apiPage} of ${apiTotalPages}`}
                >
                  {apiPage}
                </button>

                <span className="pagination-total">of {apiTotalPages}</span>

                <button
                  disabled={isLoading || apiPage >= apiTotalPages}
                  aria-label="Next page"
                  onClick={() => void loadClaims(apiPage + 1)}
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </section>

          <footer className="page-footer">
            <span>© 2026 L'Oréal Claims Intelligence Engine · Prototype</span>
            <span>
              <ShieldCheck size={14} /> Human review required for scientific
              decisions
            </span>
          </footer>
        </div>
      </main>

      {showForm && (
        <div
          className="modal-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setShowForm(false);
          }}
        >
          <section
            className="modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="form-title"
          >
            <div className="modal-header">
              <div>
                <span className="eyebrow">
                  <Sparkles size={13} /> NEW SUBMISSION
                </span>
                <h2 id="form-title">Assess a product claim</h2>
                <p>
                  Provide the claim and scientific evidence for AI-assisted
                  assessment.
                </p>
              </div>
              <button
                className="icon-button"
                onClick={() => setShowForm(false)}
                aria-label="Close"
              >
                <X size={19} />
              </button>
            </div>
            <form className="claim-form" onSubmit={handleSubmit}>
              <label>
                Product name <span>*</span>
                <input
                  required
                  maxLength={200}
                  value={form.productName}
                  onChange={(event) =>
                    updateForm("productName", event.target.value)
                  }
                  placeholder="e.g. Revitalift Clinical"
                />
              </label>
              <label>
                Marketing claim <span>*</span>
                <textarea
                  required
                  minLength={10}
                  maxLength={2000}
                  rows={3}
                  value={form.claim}
                  onChange={(event) => updateForm("claim", event.target.value)}
                  placeholder="What does the product claim to do?"
                />
              </label>
              <label>
                Scientific evidence <span>*</span>
                <textarea
                  required
                  minLength={20}
                  maxLength={50000}
                  rows={6}
                  value={form.evidence}
                  onChange={(event) =>
                    updateForm("evidence", event.target.value)
                  }
                  placeholder="Paste the study summary, methodology, sample size, outcomes and results..."
                />
                <small>
                  Include study design, sample size, measurements and
                  statistical results where available.
                </small>
              </label>
              <label>
                Submitted by
                <input
                  maxLength={100}
                  value={form.submittedBy}
                  onChange={(event) =>
                    updateForm("submittedBy", event.target.value)
                  }
                />
              </label>
              <div className="form-disclaimer">
                <ShieldCheck size={17} />
                <p>
                  AI results are decision support only. A qualified reviewer
                  must verify the evidence before any claim is approved.
                </p>
              </div>
              <div className="modal-actions">
                <button
                  type="button"
                  className="secondary-button"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="primary-button"
                  disabled={isSubmitting}
                >
                  <Sparkles size={16} />
                  {isSubmitting ? "Assessing claim..." : "Add claim"}
                  {!isSubmitting && <ArrowRight size={15} />}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}

      {selectedClaim && (
        <div
          className="modal-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setSelectedClaim(null);
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
                <h2 id="detail-title">{selectedClaim.product}</h2>
                <p>
                  {selectedClaim.id} · Submitted {selectedClaim.date}
                </p>
              </div>
              <button
                className="icon-button"
                onClick={() => {
                  setSelectedClaim(null);
                  setClaimDetails(null);
                  setDetailsError(null);
                }}
                aria-label="Close"
              >
                <X size={19} />
              </button>
            </div>
            <div className="detail-body">
              <span className="detail-label">MARKETING CLAIM</span>
              <p className="detail-claim">{selectedClaim.claim}</p>
              <div className="detail-grid">
                <div>
                  <span className="detail-label">ASSESSMENT</span>
                  <VerdictBadge verdict={selectedClaim.verdict} />
                </div>
                <div>
                  <span className="detail-label">STATUS</span>
                  <StatusBadge status={selectedClaim.status} />
                </div>
                <div>
                  <span className="detail-label">MODEL CONFIDENCE</span>
                  <strong className="detail-confidence">
                    {selectedClaim.confidence === null
                      ? "—"
                      : `${selectedClaim.confidence}%`}
                  </strong>
                </div>
              </div>

              {detailsLoading && (
                <div className="detail-notice" role="status">
                  Loading assessment details...
                </div>
              )}

              {detailsError && (
                <div className="detail-notice" role="alert">
                  <p>{detailsError}</p>
                  <button
                    className="secondary-button"
                    onClick={() => void openClaimDetails(selectedClaim)}
                  >
                    Retry
                  </button>
                </div>
              )}

              {!detailsLoading && !detailsError && claimDetails && (
                <>
                  {claimDetails.assessments[0] && (
                    <>
                      <div className="assessment-detail-section">
                        <span className="detail-label">AI REASONING</span>
                        <p className="detail-claim">
                          {claimDetails.assessments[0].reasoning ||
                            "No reasoning was returned for this assessment."}
                        </p>
                      </div>

                      <div className="assessment-detail-section">
                        <span className="detail-label">
                          SCIENTIFIC EVIDENCE
                        </span>
                        <p className="detail-claim evidence-text">
                          {claimDetails.assessments[0].evidence}
                        </p>
                      </div>

                      <div className="assessment-detail-section">
                        <span className="detail-label">
                          EVIDENCE LIMITATIONS
                        </span>

                        {claimDetails.assessments[0].limitations.length > 0 ? (
                          <ul className="limitations-list">
                            {claimDetails.assessments[0].limitations.map(
                              (limitation, index) => (
                                <li key={`${index}-${limitation}`}>
                                  {limitation}
                                </li>
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
                          AI-generated analysis is decision support only.
                          Scientific and regulatory approval requires qualified
                          human review.
                        </p>
                      </div>
                    </>
                  )}
                </>
              )}
            </div>
            <div className="modal-actions">
              <button
                className="secondary-button"
                onClick={() => {
                  setSelectedClaim(null);
                  setClaimDetails(null);
                  setDetailsError(null);
                }}
              >
                Close
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}

export default App;
