export function FormField({ label, hint, error, children, className = "" }) {
  return (
    <label className={`form-field ${className}`}>
      <span className="form-label">{label}</span>
      {hint && <span className="form-hint">{hint}</span>}
      {children}
      {error && <span className="field-error">{error}</span>}
    </label>
  );
}

export function TextInput({ label, hint, error, ...props }) {
  return (
    <FormField label={label} hint={hint} error={error}>
      <input className="text-input" {...props} />
    </FormField>
  );
}

export function TextArea({ label, hint, error, ...props }) {
  return (
    <FormField label={label} hint={hint} error={error}>
      <textarea className="text-input text-area" {...props} />
    </FormField>
  );
}

export function SelectInput({ label, hint, error, children, ...props }) {
  return (
    <FormField label={label} hint={hint} error={error}>
      <select className="text-input" {...props}>{children}</select>
    </FormField>
  );
}
