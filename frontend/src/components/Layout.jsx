import { Link } from "react-router-dom";
import { Navbar } from "./Navbar";

export function Layout({ children }) {
  return (
    <div className="app-shell">
      <Navbar />
      <main>{children}</main>
      <footer className="footer">
        <div className="footer-inner">
          <Link to="/" className="brand footer-brand">
            <span className="brand-mark">R</span>
            <span>ReverseHire</span>
          </Link>
          <p>Companies apply to candidates.</p>
          <span className="footer-note">MVP demo · built for a full-stack assessment</span>
        </div>
      </footer>
    </div>
  );
}
