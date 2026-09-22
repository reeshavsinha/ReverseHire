import { createContext, useContext, useMemo, useState } from "react";

const DemoContext = createContext(null);

const readStored = (key, fallback) => {
  try {
    return localStorage.getItem(key) || fallback;
  } catch {
    return fallback;
  }
};

export function DemoProvider({ children }) {
  const [role, setRole] = useState(() => readStored("reversehire-role", "candidate"));
  const [candidateId, setCandidateId] = useState(() =>
    readStored("reversehire-candidate", "candidate-1"),
  );
  const [companyId, setCompanyId] = useState(() =>
    readStored("reversehire-company", "company-1"),
  );

  const value = useMemo(
    () => ({
      role,
      candidateId,
      companyId,
      setRole: (nextRole) => {
        setRole(nextRole);
        localStorage.setItem("reversehire-role", nextRole);
      },
      setCandidateId: (id) => {
        setCandidateId(id);
        localStorage.setItem("reversehire-candidate", id);
      },
      setCompanyId: (id) => {
        setCompanyId(id);
        localStorage.setItem("reversehire-company", id);
      },
    }),
    [role, candidateId, companyId],
  );

  return <DemoContext.Provider value={value}>{children}</DemoContext.Provider>;
}

export function useDemo() {
  const context = useContext(DemoContext);
  if (!context) throw new Error("useDemo must be used within DemoProvider");
  return context;
}
