import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CandidateForm, candidateDefaults, toCandidatePayload } from "../components/ProfileForms";
import { ErrorState, LoadingState } from "../components/Feedback";
import { PageHeader } from "../components/PageHeader";
import { useDemo } from "../context/DemoContext";
import { useFetch } from "../hooks/useFetch";
import { api, formatApiError } from "../services/api";

const toFormValues = (candidate) => ({
  ...candidate,
  skills: candidate.skills.join(", "),
  preferredRoles: candidate.preferredRoles.join(", "),
});

export function CandidateEditPage() {
  const { candidateId } = useDemo();
  const navigate = useNavigate();
  const profile = useFetch(() => api.candidates.get(candidateId), [candidateId]);
  const [values, setValues] = useState(candidateDefaults);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (profile.data) setValues(toFormValues(profile.data));
  }, [profile.data]);

  const submit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      await api.candidates.update(candidateId, toCandidatePayload(values));
      navigate("/candidate/dashboard");
    } catch (submitError) {
      setError(formatApiError(submitError));
    } finally {
      setSubmitting(false);
    }
  };

  const remove = async () => {
    if (!window.confirm("Delete this candidate profile and its opportunities?")) return;
    try {
      await api.candidates.remove(candidateId);
      navigate("/discover");
    } catch (removeError) {
      setError(formatApiError(removeError));
    }
  };

  if (profile.loading) return <div className="container page-container"><LoadingState label="Loading your profile..." /></div>;
  if (profile.error) return <div className="container page-container"><ErrorState message={formatApiError(profile.error)} onRetry={profile.reload} /></div>;

  return (
    <div className="container narrow-container page-container">
      <Link to="/candidate/dashboard" className="back-link">← Back to dashboard</Link>
      <PageHeader eyebrow="Candidate profile" title="Make your profile memorable." description="A clear, specific profile helps the right companies recognize a good fit." />
      <CandidateForm values={values} onChange={setValues} onSubmit={submit} submitting={submitting} submitLabel="Save profile" error={error} />
      <div className="danger-zone"><div><strong>Delete profile</strong><p>This removes your profile and related opportunities from the demo.</p></div><button className="button button-ghost danger-text" onClick={remove}>Delete profile</button></div>
    </div>
  );
}
