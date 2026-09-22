import { Link } from "react-router-dom";
import { useFetch } from "../hooks/useFetch";
import { api } from "../services/api";

export function LandingPage() {
  const candidates = useFetch(api.candidates.list, []);
  const companies = useFetch(api.companies.list, []);

  return (
    <>
      <section className="hero">
        <div className="container hero-grid">
          <div className="hero-copy">
            <p className="eyebrow">A better way to get discovered</p>
            <h1>Stop applying. Let companies find you.</h1>
            <p className="hero-description">
              ReverseHire flips traditional recruitment: build your profile,
              showcase your work, and let companies send opportunities directly to you.
            </p>
            <div className="hero-actions">
              <Link to="/discover" className="button button-primary">Explore candidates <span>→</span></Link>
              <Link to="/candidate/dashboard" className="button button-secondary">View candidate demo</Link>
            </div>
            <p className="hero-note">No job boards. No application black holes. Just better conversations.</p>
            <div className="hero-create-links">
              <Link to="/candidate/new">Create a candidate profile →</Link>
              <Link to="/company/new">Create a company profile →</Link>
            </div>
          </div>
          <div className="hero-visual">
            <div className="hero-orbit orbit-one" />
            <div className="hero-orbit orbit-two" />
            <div className="hero-card hero-card-main">
              <div className="hero-card-top">
                <div className="avatar avatar-blue">M</div>
                <span className="live-pill"><span /> Open to opportunities</span>
              </div>
              <h3>Maya Patel</h3>
              <p>Frontend engineer building thoughtful product experiences</p>
              <div className="tag-row">
                <span className="tag tag-blue">React</span>
                <span className="tag tag-blue">TypeScript</span>
                <span className="tag tag-blue">Design systems</span>
              </div>
              <div className="hero-profile-footer">
                <span>⌖ Bengaluru, India</span>
                <span>↗ 4 new views</span>
              </div>
            </div>
            <div className="hero-float-card float-opportunity">
              <span className="float-icon">✦</span>
              <div><strong>New opportunity</strong><small>Senior Frontend Engineer</small></div>
            </div>
            <div className="hero-float-card float-match">
              <span className="match-number">94%</span>
              <div><strong>Strong match</strong><small>Northstar Labs</small></div>
            </div>
          </div>
        </div>
      </section>

      <section className="trust-strip">
        <div className="container trust-inner">
          <span>Built around the way modern teams really hire</span>
          <div className="trust-points"><span>Profile-first</span><span>Human-led</span><span>Mutual choice</span></div>
        </div>
      </section>

      <section className="section section-soft">
        <div className="container">
          <div className="section-intro centered">
            <p className="eyebrow">The reverse recruitment loop</p>
            <h2>Talent should not have to knock on every door.</h2>
            <p>Make your strengths visible. Let the right companies start the conversation.</p>
          </div>
          <div className="flow-grid">
            {[
              ["01", "Build your profile", "Share what you do best, what you want next, and how you like to work."],
              ["02", "Get discovered", "Companies browse real profiles instead of sorting through endless applications."],
              ["03", "Choose what fits", "Review thoughtful opportunities and decide which conversations to start."],
            ].map(([number, title, text]) => (
              <div className="flow-step" key={number}>
                <span className="step-number">{number}</span>
                <h3>{title}</h3>
                <p>{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-heading-row">
            <div>
              <p className="eyebrow">Already happening</p>
              <h2>Explore the network</h2>
            </div>
            <Link className="text-link" to="/discover">Browse all candidates →</Link>
          </div>
          <div className="stats-grid">
            <div className="stat-card"><strong>{candidates.data?.length ?? "—"}</strong><span>Candidate profiles</span></div>
            <div className="stat-card"><strong>{companies.data?.length ?? "—"}</strong><span>Growing companies</span></div>
            <div className="stat-card"><strong>100%</strong><span>Human decisions</span></div>
          </div>
        </div>
      </section>

      <section className="cta-band">
        <div className="container cta-inner">
          <div><p className="eyebrow">Your next move</p><h2>Make hiring feel more mutual.</h2></div>
          <Link to="/discover" className="button button-dark">See who is open to opportunities <span>→</span></Link>
        </div>
      </section>
    </>
  );
}
