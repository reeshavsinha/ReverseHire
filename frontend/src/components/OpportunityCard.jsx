import { Link } from "react-router-dom";
import { StatusBadge } from "./StatusBadge";

export function OpportunityCard({
  opportunity,
  perspective = "candidate",
  onAccept,
  onDecline,
  onDelete,
  actionLoading,
}) {
  const company = typeof opportunity.company === "object" ? opportunity.company : null;
  const candidate = typeof opportunity.candidate === "object" ? opportunity.candidate : null;

  return (
    <article className="opportunity-card">
      <div className="opportunity-card-top">
        <div className="opportunity-mark">{(company?.name || "O").charAt(0)}</div>
        <div className="opportunity-card-heading">
          <div className="eyebrow">{perspective === "candidate" ? company?.name : candidate?.name}</div>
          <h3>{opportunity.roleTitle}</h3>
          <p className="muted">{opportunity.location} · {formatMode(opportunity.workMode)}</p>
        </div>
        <StatusBadge status={opportunity.status} />
      </div>
      <p className="opportunity-description">{opportunity.description}</p>
      <div className="compensation">{opportunity.compensation}</div>
      <div className="message-block">
        <span className="message-label">A note from {company?.name || "the company"}</span>
        <p>“{opportunity.message}”</p>
      </div>
      <div className="opportunity-card-footer">
        <span className="muted">{formatDate(opportunity.createdAt)}</span>
        <div className="inline-actions">
          <Link className="text-link" to={`/opportunities/${opportunity.id}`}>View details</Link>
          {perspective === "candidate" && opportunity.status === "PENDING" && (
            <>
              <button className="button button-secondary button-small" onClick={() => onDecline?.(opportunity.id)} disabled={actionLoading}>
                Decline
              </button>
              <button className="button button-primary button-small" onClick={() => onAccept?.(opportunity.id)} disabled={actionLoading}>
                Accept
              </button>
            </>
          )}
          {perspective === "company" && (
            <button className="button button-ghost button-small danger-text" onClick={() => onDelete?.(opportunity.id)} disabled={actionLoading}>
              Withdraw
            </button>
          )}
        </div>
      </div>
    </article>
  );
}

export function formatMode(value) {
  return value ? value.charAt(0) + value.slice(1).toLowerCase() : "";
}

export function formatDate(value) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}
