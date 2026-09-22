import { useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { api } from "../services/api";
import { useFetch } from "../hooks/useFetch";
import { useDemo } from "../context/DemoContext";

const navClass = ({ isActive }) => (isActive ? "nav-link active" : "nav-link");

export function Navbar() {
  const { role, setRole, candidateId, companyId, setCandidateId, setCompanyId } = useDemo();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const candidates = useFetch(api.candidates.list, []);
  const companies = useFetch(api.companies.list, []);

  const candidateLinks = [
    { to: "/candidate/dashboard", label: "Dashboard" },
    { to: "/community", label: "Community" },
    { to: "/candidate/profile", label: "My profile" },
    { to: "/candidate/inbox", label: "Inbox" },
  ];
  const companyLinks = [
    { to: "/discover", label: "Discover candidates" },
    { to: "/company/dashboard", label: "Dashboard" },
    { to: "/company/opportunities/new", label: "Send opportunity" },
    { to: "/company/opportunities", label: "Sent" },
  ];

  const handleRoleChange = (nextRole) => {
    setRole(nextRole);
    setOpen(false);
    navigate(nextRole === "candidate" ? "/candidate/dashboard" : "/company/dashboard");
  };

  return (
    <header className="top-nav">
      <div className="nav-shell">
        <Link to="/" className="brand" onClick={() => setOpen(false)}>
          <span className="brand-mark">R</span>
          <span>ReverseHire</span>
        </Link>
        <button className="mobile-menu-button" onClick={() => setOpen((value) => !value)} aria-label="Toggle navigation">
          ☰
        </button>
        <div className={`nav-content ${open ? "is-open" : ""}`}>
          <nav className="main-nav">
            {(role === "candidate" ? candidateLinks : companyLinks).map((link) => (
              <NavLink className={navClass} to={link.to} key={link.to} onClick={() => setOpen(false)}>{link.label}</NavLink>
            ))}
          </nav>
          <div className="demo-switcher">
            <span className="demo-label">Demo as</span>
            <select value={role} onChange={(event) => handleRoleChange(event.target.value)} aria-label="Choose demo role">
              <option value="candidate">Candidate</option>
              <option value="company">Company</option>
            </select>
            {role === "candidate" && (
              <select value={candidateId} onChange={(event) => setCandidateId(event.target.value)} aria-label="Choose candidate profile">
                {(candidates.data || []).map((candidate) => <option value={candidate.id} key={candidate.id}>{candidate.name}</option>)}
              </select>
            )}
            {role === "company" && (
              <select value={companyId} onChange={(event) => setCompanyId(event.target.value)} aria-label="Choose company profile">
                {(companies.data || []).map((company) => <option value={company.id} key={company.id}>{company.name}</option>)}
              </select>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
