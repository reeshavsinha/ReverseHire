import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { DemoProvider } from "./context/DemoContext";
import { Layout } from "./components/Layout";
import { CandidateDiscoveryPage } from "./pages/CandidateDiscoveryPage";
import { CommunityPage } from "./pages/CommunityPage";
import { CandidateCreatePage } from "./pages/CandidateCreatePage";
import { CandidateEditPage } from "./pages/CandidateEditPage";
import { CandidateProfilePage } from "./pages/CandidateProfilePage";
import { CompanyEditPage } from "./pages/CompanyEditPage";
import { CompanyCreatePage } from "./pages/CompanyCreatePage";
import { CompanyProfilePage } from "./pages/CompanyProfilePage";
import { CreateOpportunityPage } from "./pages/CreateOpportunityPage";
import { CandidateDashboardPage } from "./pages/CandidateDashboardPage";
import { CompanyDashboardPage } from "./pages/CompanyDashboardPage";
import { LandingPage } from "./pages/LandingPage";
import { OpportunityDetailPage } from "./pages/OpportunityDetailPage";
import { OpportunityInboxPage } from "./pages/OpportunityInboxPage";
import { SentOpportunitiesPage } from "./pages/SentOpportunitiesPage";

function NotFoundPage() {
  return (
    <div className="container page-container centered-page">
      <p className="eyebrow">404</p>
      <h1>That page got away.</h1>
      <p className="page-description">The link you followed does not point to a profile or opportunity anymore.</p>
      <a className="button button-primary" href="/">Go home</a>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <DemoProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/discover" element={<CandidateDiscoveryPage />} />
            <Route path="/community" element={<CommunityPage />} />
            <Route path="/candidate/new" element={<CandidateCreatePage />} />
            <Route path="/candidates/:id" element={<CandidateProfilePage />} />
            <Route path="/companies/:id" element={<CompanyProfilePage />} />
            <Route path="/candidate/dashboard" element={<CandidateDashboardPage />} />
            <Route path="/candidate/profile" element={<CandidateProfilePage />} />
            <Route path="/candidate/edit" element={<CandidateEditPage />} />
            <Route path="/candidate/inbox" element={<OpportunityInboxPage />} />
            <Route path="/company/dashboard" element={<CompanyDashboardPage />} />
            <Route path="/company/edit" element={<CompanyEditPage />} />
            <Route path="/company/new" element={<CompanyCreatePage />} />
            <Route path="/company/opportunities/new" element={<CreateOpportunityPage />} />
            <Route path="/company/opportunities" element={<SentOpportunitiesPage />} />
            <Route path="/opportunities/:id" element={<OpportunityDetailPage />} />
            <Route path="/dashboard" element={<Navigate to="/candidate/dashboard" replace />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Layout>
      </DemoProvider>
    </BrowserRouter>
  );
}
