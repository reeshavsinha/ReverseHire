import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FormField, SelectInput, TextArea, TextInput } from "../components/FormField";
import { EmptyState, ErrorState, LoadingState } from "../components/Feedback";
import { PageHeader } from "../components/PageHeader";
import { useDemo } from "../context/DemoContext";
import { useFetch } from "../hooks/useFetch";
import { api, formatApiError } from "../services/api";

const defaults = {
  candidate: "",
  roleTitle: "",
  description: "",
  location: "",
  workMode: "REMOTE",
  compensation: "",
  message: "",
};

export function CreateOpportunityPage() {
  const { companyId } = useDemo();
  const navigate = useNavigate();
  const company = useFetch(() => api.companies.get(companyId), [companyId]);
  const candidates = useFetch(api.candidates.list, []);
  const [values, setValues] = useState(defaults);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const update = (event) => setValues((current) => ({ ...current, [event.target.name]: event.target.value }));

  const submit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      await api.opportunities.create({ ...values, company: companyId });
      navigate("/company/opportunities");
    } catch (submitError) {
      setError(formatApiError(submitError));
    } finally {
      setSubmitting(false);
    }
  };

  if (company.loading || candidates.loading) return <div className="container page-container"><LoadingState label="Preparing opportunity form..." /></div>;
  if (company.error) return <div className="container page-container"><ErrorState message={formatApiError(company.error)} onRetry={company.reload} /></div>;
  if (candidates.error) return <div className="container page-container"><ErrorState message={formatApiError(candidates.error)} onRetry={candidates.reload} /></div>;
  if (!candidates.data?.length) return <div className="container page-container"><EmptyState title="No candidates to contact" message="Candidate profiles will appear here once they are available." action={<Link className="button button-secondary" to="/discover">Browse candidates</Link>} /></div>;

  return (
    <div className="container narrow-container page-container">
      <Link to="/company/dashboard" className="back-link">← Back to dashboard</Link>
      <PageHeader eyebrow="New opportunity" title="Start with a thoughtful note." description={`You are sending this from ${company.data?.name}. Be specific about why this person caught your attention.`} />
      <form className="form-card" onSubmit={submit}>
        {error && <div className="form-error">{error}</div>}
        <div className="form-section"><div className="form-section-heading"><h2>The opportunity</h2><p>Give the role enough shape for a candidate to picture themselves in it.</p></div><div className="form-grid"><FormField label="Candidate"><select className="text-input" name="candidate" value={values.candidate} onChange={update} required><option value="">Choose a candidate</option>{candidates.data.map((candidate) => <option value={candidate.id} key={candidate.id}>{candidate.name} — {candidate.headline}</option>)}</select></FormField><TextInput label="Role title" name="roleTitle" value={values.roleTitle} onChange={update} placeholder="Senior Frontend Engineer" required /><TextArea label="Role description" name="description" value={values.description} onChange={update} placeholder="What would this person own? What would success look like?" rows="6" required /><TextInput label="Location" name="location" value={values.location} onChange={update} placeholder="Remote, Bengaluru, or Toronto" required /><SelectInput label="Work mode" name="workMode" value={values.workMode} onChange={update}><option value="REMOTE">Remote</option><option value="HYBRID">Hybrid</option><option value="ONSITE">On-site</option></SelectInput><TextInput label="Compensation" name="compensation" value={values.compensation} onChange={update} placeholder="$120k–$145k USD" required /></div></div>
        <div className="form-section"><div className="form-section-heading"><h2>Your message</h2><p>This is the first thing they will read from your company.</p></div><TextArea label="Message" name="message" value={values.message} onChange={update} placeholder="Tell them what stood out and why you think there could be a fit." rows="5" required /></div>
        <div className="form-actions"><Link className="button button-secondary" to="/company/dashboard">Cancel</Link><button type="submit" className="button button-primary" disabled={submitting}>{submitting ? "Sending..." : "Send opportunity"}</button></div>
      </form>
    </div>
  );
}
