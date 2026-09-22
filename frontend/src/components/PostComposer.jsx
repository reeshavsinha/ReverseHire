import { useState } from "react";
import { SelectInput, TextArea, TextInput } from "./FormField";
import { api, formatApiError } from "../services/api";

const defaults = {
  type: "TEXT",
  content: "",
  mediaUrl: "",
  projectTitle: "",
  projectStatus: "CURRENT",
  projectUrl: "",
};

export function PostComposer({ candidateId, onCreated }) {
  const [values, setValues] = useState(defaults);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const update = (event) =>
    setValues((current) => ({ ...current, [event.target.name]: event.target.value }));

  const submit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const created = await api.posts.create({
        ...values,
        authorId: candidateId,
        mediaType: values.type === "VIDEO" ? "VIDEO" : "",
      });
      setValues(defaults);
      onCreated?.(created);
    } catch (submitError) {
      setError(formatApiError(submitError));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="post-composer" onSubmit={submit}>
      <div className="composer-heading">
        <div className="composer-avatar avatar avatar-blue">✦</div>
        <div>
          <strong>Share an update</strong>
          <span>What are you building, learning, or thinking about?</span>
        </div>
      </div>
      {error && <div className="form-error">{error}</div>}
      <div className="composer-type-row">
        {[
          ["TEXT", "Thought"],
          ["PROJECT", "Project update"],
          ["VIDEO", "Video update"],
        ].map(([type, label]) => (
          <button
            type="button"
            className={values.type === type ? "composer-type active" : "composer-type"}
            onClick={() => setValues((current) => ({ ...current, type }))}
            key={type}
          >
            {label}
          </button>
        ))}
      </div>
      <TextArea
        label="Post content"
        name="content"
        value={values.content}
        onChange={update}
        placeholder={
          values.type === "PROJECT"
            ? "Tell your network what you are building..."
            : "Share a useful idea, lesson, or update..."
        }
        rows="4"
        required
      />
      {values.type === "PROJECT" && (
        <div className="composer-extra-grid">
          <TextInput
            label="Project name"
            name="projectTitle"
            value={values.projectTitle}
            onChange={update}
            placeholder="A project people can understand"
            required
          />
          <SelectInput
            label="Project stage"
            name="projectStatus"
            value={values.projectStatus}
            onChange={update}
          >
            <option value="CURRENT">Currently building</option>
            <option value="UPCOMING">Coming soon</option>
            <option value="COMPLETED">Completed</option>
          </SelectInput>
          <TextInput
            label="Project URL"
            name="projectUrl"
            type="url"
            value={values.projectUrl}
            onChange={update}
            placeholder="https://yourproject.com"
          />
        </div>
      )}
      {values.type === "VIDEO" && (
        <TextInput
          label="Video URL"
          name="mediaUrl"
          type="url"
          value={values.mediaUrl}
          onChange={update}
          placeholder="https://youtube.com/watch?v=..."
          required
        />
      )}
      <div className="composer-footer">
        <span className="composer-help">
          {values.type === "VIDEO" ? "Link to a hosted video." : "Keep it useful and professional."}
        </span>
        <button className="button button-primary button-small" disabled={submitting}>
          {submitting ? "Sharing..." : "Share update"}
        </button>
      </div>
    </form>
  );
}
