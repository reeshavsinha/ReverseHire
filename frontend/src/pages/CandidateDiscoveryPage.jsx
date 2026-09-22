import { useState } from "react";
import { Link } from "react-router-dom";
import { ProfileCard } from "../components/ProfileCard";
import { EmptyState, ErrorState, LoadingState } from "../components/Feedback";
import { PageHeader } from "../components/PageHeader";
import { useFetch } from "../hooks/useFetch";
import { api, formatApiError } from "../services/api";
import { useDemo } from "../context/DemoContext";

export function CandidateDiscoveryPage() {
  const { role } = useDemo();
  const [filters, setFilters] = useState({ skill: "", role: "", location: "" });
  const { data: candidates, loading, error, reload } = useFetch(
    () => api.candidates.list(filters),
    [filters.skill, filters.role, filters.location],
  );

  const updateFilter = (event) => {
    setFilters((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const clearFilters = () => setFilters({ skill: "", role: "", location: "" });

  return (
    <div className="container page-container">
      <PageHeader
        eyebrow="Discover talent"
        title="Meet people worth meeting."
        description="Browse thoughtful profiles from people who are open to the right opportunity, not just any opportunity."
        action={role === "company" ? <Link className="button button-primary" to="/company/opportunities/new">Send an opportunity</Link> : <Link className="button button-secondary" to="/candidate/profile">View your profile</Link>}
      />
      <div className="filter-panel">
        <div className="filter-heading"><span className="filter-icon">⌕</span><div><strong>Find your next great hire</strong><span>Filter by the things that matter.</span></div></div>
        <div className="filter-fields">
          <input className="text-input" name="skill" value={filters.skill} onChange={updateFilter} placeholder="Skill (e.g. React)" aria-label="Filter by skill" />
          <input className="text-input" name="role" value={filters.role} onChange={updateFilter} placeholder="Role (e.g. designer)" aria-label="Filter by role" />
          <input className="text-input" name="location" value={filters.location} onChange={updateFilter} placeholder="Location" aria-label="Filter by location" />
          {(filters.skill || filters.role || filters.location) && <button className="button button-ghost" onClick={clearFilters}>Clear</button>}
        </div>
      </div>
      <div className="results-heading"><span>{loading ? "Finding profiles..." : `${candidates?.length ?? 0} profiles`}</span><span className="muted">Updated just now</span></div>
      {loading && <LoadingState label="Finding people who could be a great fit..." />}
      {error && <ErrorState message={formatApiError(error)} onRetry={reload} />}
      {!loading && !error && candidates?.length === 0 && (
        <EmptyState title="No profiles found" message="Try broadening your filters or check back soon." action={<button className="button button-secondary" onClick={clearFilters}>Clear filters</button>} />
      )}
      {!loading && !error && candidates?.length > 0 && <div className="profile-grid">{candidates.map((candidate) => <ProfileCard key={candidate.id} candidate={candidate} />)}</div>}
    </div>
  );
}
