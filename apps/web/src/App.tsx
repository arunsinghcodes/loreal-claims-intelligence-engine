import { useEffect, useState } from "react";
import "./App.css";
import {
  assessClaim,
  getClaimById,
  getClaims,
  type ClaimDetailResponse,
} from "./api/claims";
import { AppLayout } from "./components/layout/AppLayout";
import { ClaimDetailsModal } from "./components/claims/ClaimDetailsModal";
import {
  NewClaimModal,
  type NewClaimFormData,
} from "./components/claims/NewClaimModal";
import { DashboardPage } from "./pages/DashboardPage";
import { mapApiClaim, type UIClaim } from "./types/claims";

export function App() {
  const [claims, setClaims] = useState<UIClaim[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [apiPage, setApiPage] = useState(1);
  const [apiTotalPages, setApiTotalPages] = useState(1);
  const [activeNav, setActiveNav] = useState("Overview");
  const [search, setSearch] = useState("");
  const [verdictFilter, setVerdictFilter] = useState("ALL");
  const [showForm, setShowForm] = useState(false);
  const [selectedClaim, setSelectedClaim] = useState<UIClaim | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
    let ignore = false;

    getClaims({ page: 1, limit: 10 })
      .then((response) => {
        if (!ignore) {
          setClaims(response.data.map(mapApiClaim));
          setApiPage(response.pagination.page);
          setApiTotalPages(response.pagination.totalPages);
          setApiError(null);
        }
      })
      .catch((error) => {
        if (!ignore) {
          setApiError(
            error instanceof Error
              ? error.message
              : "Unable to load claims from the server.",
          );
        }
      })
      .finally(() => {
        if (!ignore) {
          setIsLoading(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, []);

  async function handleSubmit(formData: NewClaimFormData) {
    if (isSubmitting) return;

    setIsSubmitting(true);
    setApiError(null);

    try {
      await assessClaim({
        productName: formData.productName.trim(),
        claim: formData.claim.trim(),
        evidence: formData.evidence.trim(),
        submittedBy: formData.submittedBy.trim() || "Research Team",
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

  async function openClaimDetails(claim: UIClaim) {
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

  function closeClaimDetails() {
    setSelectedClaim(null);
    setClaimDetails(null);
    setDetailsError(null);
  }

  return (
    <AppLayout
      activeNav={activeNav}
      onSelectNav={(nav) => {
        setActiveNav(nav);
        setVerdictFilter("ALL");
      }}
      claimsCount={claims.length}
      onNewAssessment={() => setShowForm(true)}
      mobileMenuOpen={mobileMenuOpen}
      onToggleMobileMenu={setMobileMenuOpen}
    >
      <DashboardPage
        activeNav={activeNav}
        onSelectNav={setActiveNav}
        claims={claims}
        isLoading={isLoading}
        apiError={apiError}
        onRetryLoad={() => void loadClaims(1)}
        search={search}
        onSearchChange={setSearch}
        verdictFilter={verdictFilter}
        onVerdictFilterChange={setVerdictFilter}
        onNewAssessment={() => setShowForm(true)}
        onSelectClaim={(claim) => void openClaimDetails(claim)}
        page={apiPage}
        totalPages={apiTotalPages}
        onPageChange={(page) => void loadClaims(page)}
      />

      <NewClaimModal
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />

      <ClaimDetailsModal
        claim={selectedClaim}
        details={claimDetails}
        isLoading={detailsLoading}
        error={detailsError}
        onClose={closeClaimDetails}
        onRetry={() => {
          if (selectedClaim) void openClaimDetails(selectedClaim);
        }}
      />
    </AppLayout>
  );
}

export default App;
