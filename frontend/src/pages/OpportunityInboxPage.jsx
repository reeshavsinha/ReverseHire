import { useState } from "react";
import { Link } from "react-router-dom";
import { OpportunityCard } from "../components/OpportunityCard";
import { EmptyState, ErrorState, LoadingState } from "../components/Feedback";
import { PageHeader } from "../components/PageHeader";
import { useDemo } from "../context/DemoContext";
import { useFetch } from "../hooks/useFetch";
import { api, formatApiError } from "../services/api";

export function OpportunityInboxPage() {
  const { candidateId } = useDemo();
  const [filter, setFilter] = useState("ALL");
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState("");
  const opportunities = useFetch(() => api.opportunities.list({ candidateId }), [candidateId]);

  const answer = async (id, action) => {
    setActionLoading(true);
    setActionError("");
    try {
      await api.opportunities[action](id);
      await opportunities.reload();
    } catch (error) {
      setActionError(formatApiError(error));
    } finally {
      setActionLoading(false);
    }
  };

  const items = (opportunities.data || []).filter((item) => filter === "ALL" || item.status === filter);

  return (
    <div className="container page-container">
      <PageHeader eyebrow="Candidate inbox" title="Opportunities, on your terms." description="Every message here started with a company finding your profile. Take your time, then choose what feels right." action={<Link className="button button-secondary" to="/candidate/edit">Update profile</Link>} />
      <div className="tabs"><button className={filter === "ALL" ? "tab active" : "tab"} onClick={() => setFilter("ALL")}>All <span>{opportunities.data?.length ?? 0}</span></button><button className={filter === "PENDING" ? "tab active" : "tab"} onClick={() => setFilter("PENDING")}>Pending <span>{(opportunities.data || []).filter((item) => item.status === "PENDING").length}</span></button><button className={filter === "ACCEPTED" ? "tab active" : "tab"} onClick={() => setFilter("ACCEPTED")}>Accepted</button><button className={filter === "DECLINED" ? "tab active" : "tab"} onClick={() => setFilter("DECLINED")}>Declined</button></div>
      {opportunities.loading && <LoadingState label="Checking your inbox..." />}
      {opportunities.error && <ErrorState message={formatApiError(opportunities.error)} onRetry={opportunities.reload} />}
      {actionError && <div className="form-error">{actionError}</div>}
      {!opportunities.loading && !opportunities.error && items.length === 0 && <EmptyState title={filter === "ALL" ? "Your inbox is quiet" : `No ${filter.toLowerCase()} opportunities`} message="Companies will send thoughtful opportunities here when they discover your profile." action={<Link className="button button-secondary" to="/discover">Explore profiles</Link>} />}
      {!opportunities.loading && !opportunities.error && items.length > 0 && <div className="opportunity-list">{items.map((item) => <OpportunityCard key={item.id} opportunity={item} onAccept={(id) => answer(id, "accept")} onDecline={(id) => answer(id, "decline")} actionLoading={actionLoading} />)}</div>}
    </div>
  );
}
