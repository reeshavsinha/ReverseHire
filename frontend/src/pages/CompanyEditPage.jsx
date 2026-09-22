import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CompanyForm, companyDefaults } from "../components/ProfileForms";
import { ErrorState, LoadingState } from "../components/Feedback";
import { PageHeader } from "../components/PageHeader";
import { useDemo } from "../context/DemoContext";
import { useFetch } from "../hooks/useFetch";
import { api, formatApiError } from "../services/api";

export function CompanyEditPage() {
  const { companyId } = useDemo();
  const navigate = useNavigate();
  const profile = useFetch(() => api.companies.get(companyId), [companyId]);
  const [values, setValues] = useState(companyDefaults);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (profile.data) setValues(profile.data);
  }, [profile.data]);

  const submit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      await api.companies.update(companyId, values);
      navigate("/company/dashboard");
    } catch (submitError) {
      setError(formatApiError(submitError));
    } finally {
      setSubmitting(false);
    }
  };

  const remove = async () => {
    if (!window.confirm("Delete this company profile and its opportunities?")) return;
    try {
      await api.companies.remove(companyId);
      navigate("/discover");
    } catch (removeError) {
      setError(formatApiError(removeError));
    }
  };

  if (profile.loading) return <div className="container page-container"><LoadingState label="Loading company profile..." /></div>;
  if (profile.error) return <div className="container page-container"><ErrorState message={formatApiError(profile.error)} onRetry={profile.reload} /></div>;

  return (
    <div className="container narrow-container page-container">
      <Link to="/company/dashboard" className="back-link">← Back to dashboard</Link>
      <PageHeader eyebrow="Company profile" title="Give great people a reason to look twice." description="A clear company profile helps candidates understand your mission before they decide to respond." />
      <CompanyForm values={values} onChange={setValues} onSubmit={submit} submitting={submitting} submitLabel="Save company profile" error={error} />
      <div className="danger-zone"><div><strong>Delete company profile</strong><p>This removes your company and related opportunities from the demo.</p></div><button className="button button-ghost danger-text" onClick={remove}>Delete profile</button></div>
    </div>
  );
}
