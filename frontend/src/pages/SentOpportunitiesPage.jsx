import { useState } from "react";
import { Link } from "react-router-dom";
import { EmptyState, ErrorState, LoadingState } from "../components/Feedback";
import { OpportunityCard } from "../components/OpportunityCard";
import { PageHeader } from "../components/PageHeader";
import { useDemo } from "../context/DemoContext";
import { useFetch } from "../hooks/useFetch";
import { api, formatApiError } from "../services/api";

export function SentOpportunitiesPage() {
  const { companyId } = useDemo();
  const [filter, setFilter] = useState("ALL");
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState("");
  const opportunities = useFetch(() => api.opportunities.list({ companyId }), [companyId]);

  const remove = async (id) => {
    if (!window.confirm("Withdraw this opportunity?")) return;
    setActionLoading(true);
    setActionError("");
    try {
      await api.opportunities.remove(id);
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
      <PageHeader eyebrow="Company outreach" title="The conversations you started." description="Keep track of every opportunity your team has sent and what happened next." action={<Link className="button button-primary" to="/company/opportunities/new">Send opportunity <span>→</span></Link>} />
      <div className="tabs"><button className={filter === "ALL" ? "tab active" : "tab"} onClick={() => setFilter("ALL")}>All <span>{opportunities.data?.length ?? 0}</span></button><button className={filter === "PENDING" ? "tab active" : "tab"} onClick={() => setFilter("PENDING")}>Pending</button><button className={filter === "ACCEPTED" ? "tab active" : "tab"} onClick={() => setFilter("ACCEPTED")}>Accepted</button><button className={filter === "DECLINED" ? "tab active" : "tab"} onClick={() => setFilter("DECLINED")}>Declined</button></div>
      {opportunities.loading && <LoadingState label="Loading sent opportunities..." />}
      {opportunities.error && <ErrorState message={formatApiError(opportunities.error)} onRetry={opportunities.reload} />}
      {actionError && <div className="form-error">{actionError}</div>}
      {!opportunities.loading && !opportunities.error && items.length === 0 && <EmptyState title="Nothing here yet" message="When your team sends an opportunity, it will appear here." action={<Link className="button button-primary" to="/discover">Discover candidates</Link>} />}
      {!opportunities.loading && !opportunities.error && items.length > 0 && <div className="opportunity-list">{items.map((item) => <OpportunityCard key={item.id} opportunity={item} perspective="company" onDelete={remove} actionLoading={actionLoading} />)}</div>}
    </div>
  );
}
