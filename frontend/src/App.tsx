import React from 'react';
import { BrandGuardProvider, useBrandGuard } from './context/BrandGuardContext';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { OnboardingWizardPage } from './pages/OnboardingWizardPage';
import { Sidebar } from './components/layout/Sidebar';
import { Topbar } from './components/layout/Topbar';
import { OverviewPage } from './pages/OverviewPage';
import { CheckLinkPage } from './pages/CheckLinkPage';
import { SocialMonitoringPage } from './pages/SocialMonitoringPage';
import { AppMonitoringPage } from './pages/AppMonitoringPage';
import { FindingsPage } from './pages/FindingsPage';
import { BrandProfilePage } from './pages/BrandProfilePage';
import { SettingsPage } from './pages/SettingsPage';
import { FindingDetailDrawer } from './components/findings/FindingDetailDrawer';
import { StepByStepReportModal } from './components/findings/StepByStepReportModal';
import { ScanResultsView } from './components/scan/ScanResultsView';
import { LoadingScanModal } from './components/common/LoadingScanModal';
import { ToastNotification } from './components/common/ToastNotification';
import { WatchlistPage } from './pages/WatchlistPage';
import { ScamScriptAnalyzerPage } from './pages/ScamScriptAnalyzerPage';
import { UnicodeXRayPage } from './pages/UnicodeXRayPage';
import { CustomerWarningKitPage } from './pages/CustomerWarningKitPage';
import { BoardReportPage } from './pages/BoardReportPage';
import { AlertPreviewPage } from './pages/AlertPreviewPage';
import { BrandShieldIntroAnimation } from './components/landing/BrandShieldIntroAnimation';

const MainAppRouter: React.FC = () => {
  const { 
    viewMode, 
    activePage, 
    selectedFinding, 
    setSelectedFinding,
    reportModalFinding,
    closeReportModal,
    isAuthenticated,
    isLoadingAuth 
  } = useBrandGuard();

  // 1. First screen MUST be the Landing Page for visitors (loads immediately)
  if (viewMode === 'landing') {
    return (
      <>
        <LandingPage />
        <ToastNotification />
      </>
    );
  }

  // Loading auth session check for dashboard views
  if (isLoadingAuth) {
    return (
      <div className="min-h-screen bg-[#070A14] flex flex-col items-center justify-center text-slate-300">
        <div className="w-8 h-8 border-2 border-[#8050FF]/30 border-t-[#42DDF5] rounded-full animate-spin mb-3" />
        <span className="text-xs font-semibold font-mono text-slate-400">Loading AEGIS SOC...</span>
      </div>
    );
  }

  // 2. Authentication: Login Page
  if (viewMode === 'login') {
    return (
      <>
        <LoginPage />
        <ToastNotification />
      </>
    );
  }

  // 3. Authentication: Forgot Password Page
  if (viewMode === 'forgot-password') {
    return (
      <>
        <ForgotPasswordPage />
        <ToastNotification />
      </>
    );
  }

  // 4. Company Onboarding Wizard (4 steps)
  if (viewMode === 'onboarding') {
    return (
      <>
        <OnboardingWizardPage />
        <ToastNotification />
      </>
    );
  }

  // 5. Protected Dashboard: Never show to a logged-out user
  if (!isAuthenticated) {
    return (
      <>
        <LoginPage />
        <ToastNotification />
      </>
    );
  }

  const renderActivePage = () => {
    switch (activePage) {
      case 'home':
        return <OverviewPage />;
      case 'check-link':
        return <CheckLinkPage />;
      case 'scan-results':
        return <ScanResultsView />;
      case 'social':
        return <FindingsPage />;
      case 'apps':
        return <FindingsPage />;
      case 'findings':
        return <FindingsPage />;
      case 'brand-profile':
        return <BrandProfilePage />;
      case 'settings':
        return <SettingsPage />;
      case 'watchlist':
        return <WatchlistPage />;
      case 'scam-analyzer':
        return <ScamScriptAnalyzerPage />;
      case 'unicode-xray':
        return <UnicodeXRayPage />;
      case 'warning-kit':
        return <CustomerWarningKitPage />;
      case 'board-report':
        return <BoardReportPage />;
      case 'alert-preview':
        return <AlertPreviewPage />;
      default:
        return <OverviewPage />;
    }
  };

  return (
    <div className="flex h-screen bg-navy-950 text-slate-100 overflow-hidden font-sans">
      {/* Left Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Topbar */}
        <Topbar />

        {/* Scrollable Page Body */}
        <main className="flex-1 overflow-y-auto px-6 py-6 scroll-smooth">
          {renderActivePage()}
        </main>
      </div>

      {/* Finding Detail Side Drawer */}
      <FindingDetailDrawer
        finding={selectedFinding}
        onClose={() => setSelectedFinding(null)}
      />

      {/* Step-by-Step 5-Stage Progressive Disclosure Report Modal */}
      <StepByStepReportModal
        finding={reportModalFinding}
        onClose={closeReportModal}
      />

      {/* Global Threat Scanning Modal Overlay */}
      <LoadingScanModal />

      {/* Global Interactive Toast Notification Stack */}
      <ToastNotification />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <BrandGuardProvider>
      <MainAppRouter />
    </BrandGuardProvider>
  );
};

export default App;
