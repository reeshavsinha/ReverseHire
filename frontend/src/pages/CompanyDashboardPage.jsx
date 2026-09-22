import { Link } from "react-router-dom";
import { EmptyState, ErrorState, LoadingState } from "../components/Feedback";
import { OpportunityCard } from "../components/OpportunityCard";
import { PageHeader } from "../components/PageHeader";
import { useDemo } from "../context/DemoContext";
import { useFetch } from "../hooks/useFetch";
import { api, formatApiError } from "../services/api";

export function CompanyDashboardPage() {
  const { companyId } = useDemo();
  const profile = useFetch(() => api.companies.get(companyId), [companyId]);
  const opportunities = useFetch(() => api.opportunities.list({ companyId }), [companyId]);
  const items = opportunities.data || [];
  const stats = [
    ["Sent", items.length, "stat-blue"],
    ["Pending", items.filter((item) => item.status === "PENDING").length, "stat-yellow"],
    ["Accepted", items.filter((item) => item.status === "ACCEPTED").length, "stat-green"],
    ["Declined", items.filter((item) => item.status === "DECLINED").length, "stat-gray"],
  ];

  return (
    <div className="container page-container">
      <PageHeader eyebrow="Company workspace" title={`Welcome back, ${profile.data?.name || "team"}.`} description="Find people who could change what your company can build next." action={<Link className="button button-primary" to="/company/opportunities/new">Send opportunity <span>→</span></Link>} />
      {profile.loading && <LoadingState label="Loading company profile..." />}
      {profile.error && <ErrorState message={formatApiError(profile.error)} onRetry={profile.reload} />}
      {profile.data && <section className="summary-card company-summary"><div className="summary-avatar company-logo">{profile.data.name.charAt(0)}</div><div className="summary-content"><div className="summary-top"><div><h2>{profile.data.name}</h2><p>{profile.data.industry} · {profile.data.location}</p></div><Link className="text-link" to="/company/edit">Edit company profile →</Link></div><p className="summary-description">{profile.data.description}</p></div></section>}
      <div className="stats-grid dashboard-stats">{stats.map(([label, value, color]) => <div className={`stat-card ${color}`} key={label}><strong>{opportunities.loading ? "—" : value}</strong><span>{label === "Sent" ? "Opportunities sent" : `${label} opportunities`}</span></div>)}</div>
      <section className="dashboard-action-grid"><Link className="dashboard-action-card action-blue" to="/discover"><span className="action-card-icon">⌕</span><div><strong>Discover candidates</strong><p>Browse skills, roles, locations, and project work before you reach out.</p></div><span className="action-arrow">→</span></Link><Link className="dashboard-action-card action-beige" to="/company/opportunities/new"><span className="action-card-icon">✦</span><div><strong>Make a thoughtful introduction</strong><p>Send an opportunity with enough context for a candidate to picture the role.</p></div><span className="action-arrow">→</span></Link></section>
      <section className="dashboard-section"><div className="section-heading-row"><div><p className="eyebrow">Your outreach</p><h2>Recent opportunities</h2></div><Link className="text-link" to="/company/opportunities">See all sent →</Link></div>{opportunities.loading && <LoadingState label="Loading sent opportunities..." />}{opportunities.error && <ErrorState message={formatApiError(opportunities.error)} onRetry={opportunities.reload} />}{!opportunities.loading && !opportunities.error && items.length === 0 && <EmptyState title="No opportunities yet" message="Browse the network and send a thoughtful note to someone who stands out." action={<Link className="button button-primary" to="/discover">Discover candidates</Link>} />}{!opportunities.loading && items.length > 0 && <div className="opportunity-list">{items.slice(0, 3).map((item) => <OpportunityCard key={item.id} opportunity={item} perspective="company" />)}</div>}</section>
    </div>
  );
}
