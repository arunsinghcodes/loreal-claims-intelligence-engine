import {
  ArrowRight,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  FlaskConical,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";
import type { UIClaim } from "../../types/claims";
import { StatusBadge, VerdictBadge } from "../ui/StatusBadge";

export interface RecentClaimsTableProps {
  claims: UIClaim[];
  totalClaimsCount: number;
  search: string;
  onSearchChange: (value: string) => void;
  verdictFilter: string;
  onVerdictFilterChange: (value: string) => void;
  onSelectClaim: (claim: UIClaim) => void;
  onViewAllClaims: () => void;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
}

export function RecentClaimsTable({
  claims,
  totalClaimsCount,
  search,
  onSearchChange,
  verdictFilter,
  onVerdictFilterChange,
  onSelectClaim,
  onViewAllClaims,
  page,
  totalPages,
  onPageChange,
  isLoading = false,
}: RecentClaimsTableProps) {
  return (
    <section className="panel claims-panel">
      <div className="claims-heading">
        <div>
          <h3>Recent claims</h3>
          <p>Browse and review submitted product claims</p>
        </div>
        <button className="secondary-button" onClick={onViewAllClaims}>
          View all claims <ArrowRight size={15} />
        </button>
      </div>

      <div className="table-toolbar">
        <label className="search-box">
          <Search size={17} />
          <input
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search product, claim or ID..."
          />
          {search && (
            <button
              className="search-clear"
              onClick={() => onSearchChange("")}
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
            onChange={(event) => onVerdictFilterChange(event.target.value)}
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
            {claims.map((claim) => (
              <tr key={claim.id}>
                <td>
                  <button
                    className="claim-title-button"
                    onClick={() => onSelectClaim(claim)}
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
                    onClick={() => onSelectClaim(claim)}
                  >
                    <ArrowRight size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {claims.length === 0 && (
          <div className="empty-state">
            <Search size={24} />
            <strong>No matching claims</strong>
            <span>Try changing the search or filter.</span>
            <button
              className="text-button"
              onClick={() => {
                onSearchChange("");
                onVerdictFilterChange("ALL");
              }}
            >
              Clear filters
            </button>
          </div>
        )}
      </div>

      <div className="table-footer">
        <span>
          Showing <strong>{claims.length}</strong> of{" "}
          <strong>{totalClaimsCount}</strong> claims
        </span>

        <div className="pagination-controls">
          <button
            disabled={isLoading || page <= 1}
            aria-label="Previous page"
            onClick={() => onPageChange(page - 1)}
          >
            <ChevronLeft size={16} />
          </button>

          <button
            className="page-number"
            disabled
            aria-label={`Page ${page} of ${totalPages}`}
          >
            {page}
          </button>

          <span className="pagination-total">of {totalPages}</span>

          <button
            disabled={isLoading || page >= totalPages}
            aria-label="Next page"
            onClick={() => onPageChange(page + 1)}
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </section>
  );
}

