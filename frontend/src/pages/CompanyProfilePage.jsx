import { Link, useParams } from "react-router-dom";
import { EmptyState, ErrorState, LoadingState } from "../components/Feedback";
import { PageHeader } from "../components/PageHeader";
import { useFetch } from "../hooks/useFetch";
import { api, formatApiError } from "../services/api";

export function CompanyProfilePage() {
  const { id } = useParams();
  const { data: company, loading, error, reload } = useFetch(() => api.companies.get(id), [id]);

  if (loading) return <div className="container page-container"><LoadingState label="Loading company..." /></div>;
  if (error) return <div className="container page-container"><ErrorState message={formatApiError(error)} onRetry={reload} /></div>;
  if (!company) return <div className="container page-container"><EmptyState title="Company not found" message="This company may have been removed." /></div>;

  return (
    <div className="container page-container">
      <Link to="/discover" className="back-link">← Back to discover</Link>
      <section className="company-profile-hero">
        <div className="company-logo">{company.name.charAt(0)}</div>
        <div><p className="eyebrow">Company profile</p><h1>{company.name}</h1><p className="profile-headline">{company.industry}</p><div className="meta-row"><span>⌖ {company.location}</span><span>▦ {company.companySize} people</span></div></div>
        <a className="button button-secondary" href={company.website} target="_blank" rel="noreferrer">Visit website ↗</a>
      </section>
      <div className="detail-grid single-sidebar">
        <section className="detail-card"><p className="eyebrow">About the company</p><h2>What {company.name} is building</h2><p className="long-copy">{company.description}</p></section>
        <aside className="detail-sidebar"><section className="detail-card"><p className="eyebrow">At a glance</p><div className="company-facts"><div><span>Industry</span><strong>{company.industry}</strong></div><div><span>Location</span><strong>{company.location}</strong></div><div><span>Company size</span><strong>{company.companySize} people</strong></div></div></section><section className="detail-card accent-card"><p className="eyebrow">Looking for talent?</p><p>Switch to company demo mode to explore sending an opportunity.</p><Link className="text-link" to="/company/opportunities/new">Send an opportunity →</Link></section></aside>
      </div>
    </div>
  );
}
