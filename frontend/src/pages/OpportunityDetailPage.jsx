import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { EmptyState, ErrorState, LoadingState } from "../components/Feedback";
import { OpportunityCard } from "../components/OpportunityCard";
import { useDemo } from "../context/DemoContext";
import { useFetch } from "../hooks/useFetch";
import { api, formatApiError } from "../services/api";

export function OpportunityDetailPage() {
  const { id } = useParams();
  const { role } = useDemo();
  const navigate = useNavigate();
  const opportunity = useFetch(() => api.opportunities.get(id), [id]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const action = async (method) => {
    setLoading(true);
    setError("");
    try {
      await api.opportunities[method](id);
      await opportunity.reload();
    } catch (actionError) {
      setError(formatApiError(actionError));
    } finally {
      setLoading(false);
    }
  };

  if (opportunity.loading) return <div className="container page-container"><LoadingState label="Loading opportunity..." /></div>;
  if (opportunity.error) return <div className="container page-container"><ErrorState message={formatApiError(opportunity.error)} onRetry={opportunity.reload} /></div>;
  if (!opportunity.data) return <div className="container page-container"><EmptyState title="Opportunity not found" message="This opportunity may have been withdrawn." /></div>;

  const backPath = role === "company" ? "/company/opportunities" : "/candidate/inbox";
  return (
    <div className="container narrow-container page-container">
      <Link to={backPath} className="back-link">← Back to {role === "company" ? "sent opportunities" : "inbox"}</Link>
      <div className="detail-page-heading"><p className="eyebrow">Opportunity detail</p><h1>{opportunity.data.roleTitle}</h1><p className="page-description">From {opportunity.data.company?.name} · {opportunity.data.location}</p></div>
      {error && <div className="form-error">{error}</div>}
      <OpportunityCard opportunity={opportunity.data} perspective={role} onAccept={() => action("accept")} onDecline={() => action("decline")} onDelete={async () => { await api.opportunities.remove(id); navigate(backPath); }} actionLoading={loading} />
      <section className="detail-card opportunity-detail-section"><p className="eyebrow">What happens next</p><p className="long-copy">{role === "candidate" ? "Accepting lets the company know they can follow up with you. Declining closes this opportunity respectfully." : "A pending opportunity stays open until the candidate accepts or declines it."}</p></section>
    </div>
  );
}
