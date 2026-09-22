import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CandidateForm, candidateDefaults, toCandidatePayload } from "../components/ProfileForms";
import { PageHeader } from "../components/PageHeader";
import { useDemo } from "../context/DemoContext";
import { api, formatApiError } from "../services/api";

export function CandidateCreatePage() {
  const { setCandidateId, setRole } = useDemo();
  const navigate = useNavigate();
  const [values, setValues] = useState(candidateDefaults);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const submit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const created = await api.candidates.create(toCandidatePayload(values));
      setCandidateId(created.id);
      setRole("candidate");
      navigate("/candidate/dashboard");
    } catch (submitError) {
      setError(formatApiError(submitError));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container narrow-container page-container">
      <Link to="/" className="back-link">← Back home</Link>
      <PageHeader eyebrow="Create your profile" title="Let the right companies find you." description="Share enough context for a thoughtful first conversation." />
      <CandidateForm values={values} onChange={setValues} onSubmit={submit} submitting={submitting} submitLabel="Create profile" error={error} />
    </div>
  );
}
