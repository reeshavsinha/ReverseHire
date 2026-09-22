import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CompanyForm, companyDefaults } from "../components/ProfileForms";
import { PageHeader } from "../components/PageHeader";
import { useDemo } from "../context/DemoContext";
import { api, formatApiError } from "../services/api";

export function CompanyCreatePage() {
  const { setCompanyId, setRole } = useDemo();
  const navigate = useNavigate();
  const [values, setValues] = useState(companyDefaults);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const submit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const created = await api.companies.create(values);
      setCompanyId(created.id);
      setRole("company");
      navigate("/company/dashboard");
    } catch (submitError) {
      setError(formatApiError(submitError));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container narrow-container page-container">
      <Link to="/" className="back-link">← Back home</Link>
      <PageHeader eyebrow="Create a company profile" title="Show people what your team is building." description="A strong company profile gives great candidates a reason to reply." />
      <CompanyForm values={values} onChange={setValues} onSubmit={submit} submitting={submitting} submitLabel="Create company profile" error={error} />
    </div>
  );
}
