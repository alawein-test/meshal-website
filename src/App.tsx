import { lazy, Suspense } from 'react';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { HelmetProvider } from 'react-helmet-async';
import { ThemeProvider } from './context/ThemeContext';
import PageTransition from './components/PageTransition';
import { CommandPalette } from './components/CommandPalette';
import { KeyboardShortcutsHelp } from './components/KeyboardShortcutsHelp';
import { useGlobalShortcuts } from './hooks/useKeyboardShortcuts';
import { useVisitorTracking } from './hooks/useVisitorTracking';
import { OnboardingTour } from './components/OnboardingTour';
import { NewUserOnboarding } from './components/onboarding/NewUserOnboarding';
import { LoadingState } from '@/components/dashboard';
import { RouteProgressBar } from '@/components/shared/RouteProgressBar';
import { SkipToMain } from '@/components/shared/SkipToMain';
import { RouteAnnouncer } from '@/components/shared/RouteAnnouncer';
import { AppErrorBoundary } from '@/components/shared/AppErrorBoundary';
import { AIConsentModal } from '@/components/shared/AIConsentModal';

// Eagerly loaded pages (critical path)
import Landing from './pages/Landing';
import NotFound from './pages/NotFound';

// Lazy loaded pages
const Portfolio = lazy(() => import('./pages/Portfolio'));
const Resume = lazy(() => import('./pages/Resume'));
const DesignSystem = lazy(() => import('./pages/DesignSystem'));
const PlatformPreview = lazy(() => import('./pages/PlatformPreview'));
const IconAssets = lazy(() => import('./pages/IconAssets'));
const StickerPack = lazy(() => import('./pages/StickerPack'));
const BrandConsistency = lazy(() => import('./pages/BrandConsistency'));
const ProjectDetail = lazy(() => import('./pages/ProjectDetail'));
const Auth = lazy(() => import('./pages/Auth'));
const Profile = lazy(() => import('./pages/Profile'));
const Settings = lazy(() => import('./pages/Settings'));
const InteractiveResume = lazy(() => import('./pages/InteractiveResume'));
const ComponentDocs = lazy(() => import('./pages/ComponentDocs'));
const Install = lazy(() => import('./pages/Install'));
const ServicesHub = lazy(() => import('./pages/services/ServicesHub'));
const HeuristicEvaluation = lazy(() => import('./pages/services/HeuristicEvaluation'));
const AccessibilityAudit = lazy(() => import('./pages/services/AccessibilityAudit'));
const UserFlowAnalysis = lazy(() => import('./pages/services/UserFlowAnalysis'));
const DesignSystemReview = lazy(() => import('./pages/services/DesignSystemReview'));
const PerformanceTesting = lazy(() => import('./pages/services/PerformanceTesting'));
const SecurityAssessment = lazy(() => import('./pages/services/SecurityAssessment'));
const Pricing = lazy(() => import('./pages/Pricing'));
const Book = lazy(() => import('./pages/Book'));

const StudioSelector = lazy(() => import('./studios/StudioSelector'));
const PlatformsHub = lazy(() => import('./studios/platforms/PlatformsHub'));
const TemplatesHub = lazy(() => import('./studios/templates/TemplatesHub'));

// Lazy loaded projects
const ProjectsHub = lazy(() => import('./projects/pages/ProjectsHub'));
const SimCoreDashboard = lazy(() => import('./projects/pages/simcore/SimCoreDashboard'));
const MEZANDashboard = lazy(() => import('./projects/pages/mezan/MEZANDashboard'));
const TalAIDashboard = lazy(() => import('./projects/pages/talai/TalAIDashboard'));
const TalAIShowcase = lazy(() => import('./pages/projects/TalAI'));
const REPZShowcase = lazy(() => import('./pages/projects/REPZ'));
const LiveItIconicShowcase = lazy(() => import('./pages/projects/LiveItIconic'));
const AttributaShowcase = lazy(() => import('./pages/projects/Attributa'));
const LLMWorksShowcase = lazy(() => import('./pages/projects/LLMWorks'));
const TemplateMarketplace = lazy(() => import('./pages/store/TemplateMarketplace'));
const ServicesPage = lazy(() => import('./pages/store/Services'));
const LibrexPlayground = lazy(() => import('./pages/playground/LibrexPlayground'));
const LitReviewBot = lazy(() => import('./pages/projects/talai/LitReviewBot'));
const GrantWriter = lazy(() => import('./pages/projects/talai/GrantWriter'));
const TransparencyReport = lazy(() => import('./pages/Transparency'));
const Terms = lazy(() => import('./pages/Terms'));
const Privacy = lazy(() => import('./pages/Privacy'));
const Changelog = lazy(() => import('./pages/Changelog'));
const ApiDocs = lazy(() => import('./pages/docs/ApiDocs'));
const UnifiedScanner = lazy(() => import('./pages/UnifiedScanner'));
const WaitlistManagement = lazy(() => import('./pages/admin/WaitlistManagement'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const OptiLibriaDashboard = lazy(() => import('./projects/pages/optilibria/OptiLibriaDashboard'));
const QMLabDashboard = lazy(() => import('./projects/pages/qmlab/QMLabDashboard'));

// Create query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 1000 * 60 * 5 },
  },
});

// Suspense fallback component
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <LoadingState />
  </div>
);

function AppRoutes() {
  useGlobalShortcuts();
  useVisitorTracking({
    trackBehaviors: true,
    trackScroll: true,
    trackClicks: true,
    excludedPaths: ['/admin'],
  });

  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Landing - Public (eagerly loaded) */}
        <Route
          path="/"
          element={
            <PageTransition>
              <Landing />
            </PageTransition>
          }
        />

        {/* Portfolio - Public */}
        <Route
          path="/portfolio"
          element={
            <PageTransition>
              <Portfolio />
            </PageTransition>
          }
        />

        {/* Resume */}
        <Route
          path="/resume"
          element={
            <PageTransition>
              <Resume />
            </PageTransition>
          }
        />

        {/* Studios Hub - Public */}
        <Route
          path="/studios"
          element={
            <PageTransition>
              <StudioSelector />
            </PageTransition>
          }
        />

        {/* Platforms Hub - Public */}
        <Route
          path="/platforms"
          element={
            <PageTransition>
              <PlatformsHub />
            </PageTransition>
          }
        />

        {/* Projects Hub - Public */}
        <Route
          path="/projects"
          element={
            <PageTransition>
              <ProjectsHub />
            </PageTransition>
          }
        />

        {/* Project Detail Page */}
        <Route
          path="/project/:projectId"
          element={
            <PageTransition>
              <ProjectDetail />
            </PageTransition>
          }
        />

        {/* Platform Previews */}
        <Route
          path="/preview/:platformId"
          element={
            <PageTransition>
              <PlatformPreview />
            </PageTransition>
          }
        />

        {/* Project Dashboards - Now Public */}
        <Route
          path="/projects/simcore"
          element={
            <PageTransition>
              <SimCoreDashboard />
            </PageTransition>
          }
        />
        <Route
          path="/projects/mezan"
          element={
            <PageTransition>
              <MEZANDashboard />
            </PageTransition>
          }
        />
        <Route
          path="/projects/talai"
          element={
            <PageTransition>
              <TalAIDashboard />
            </PageTransition>
          }
        />
        {/* TalAI Showcase - Product Grid */}
        <Route
          path="/projects/talai/showcase"
          element={
            <PageTransition>
              <TalAIShowcase />
            </PageTransition>
          }
        />
        <Route
          path="/projects/optilibria"
          element={
            <PageTransition>
              <OptiLibriaDashboard />
            </PageTransition>
          }
        />
        <Route
          path="/projects/qmlab"
          element={
            <PageTransition>
              <QMLabDashboard />
            </PageTransition>
          }
        />

        {/* Production Platform Showcases */}
        <Route
          path="/projects/repz"
          element={
            <PageTransition>
              <REPZShowcase />
            </PageTransition>
          }
        />
        <Route
          path="/projects/liveiticonic"
          element={
            <PageTransition>
              <LiveItIconicShowcase />
            </PageTransition>
          }
        />
        <Route
          path="/projects/attributa"
          element={
            <PageTransition>
              <AttributaShowcase />
            </PageTransition>
          }
        />
        <Route
          path="/projects/llmworks"
          element={
            <PageTransition>
              <LLMWorksShowcase />
            </PageTransition>
          }
        />

        {/* Design System - Public (dev only) */}
        <Route
          path="/design-system"
          element={
            <PageTransition>
              <DesignSystem />
            </PageTransition>
          }
        />

        {/* Icon Assets - Public (dev only) */}
        <Route
          path="/icon-assets"
          element={
            <PageTransition>
              <IconAssets />
            </PageTransition>
          }
        />

        {/* Sticker Pack - Public */}
        <Route
          path="/stickers"
          element={
            <PageTransition>
              <StickerPack />
            </PageTransition>
          }
        />

        {/* Brand Consistency - Public (dev only) */}
        <Route
          path="/brand"
          element={
            <PageTransition>
              <BrandConsistency />
            </PageTransition>
          }
        />

        {/* Auth */}
        <Route
          path="/auth"
          element={
            <PageTransition>
              <Auth />
            </PageTransition>
          }
        />

        {/* Profile */}
        <Route
          path="/profile"
          element={
            <PageTransition>
              <Profile />
            </PageTransition>
          }
        />

        {/* Settings */}
        <Route
          path="/settings"
          element={
            <PageTransition>
              <Settings />
            </PageTransition>
          }
        />

        {/* Interactive Resume */}
        <Route
          path="/interactive-resume"
          element={
            <PageTransition>
              <InteractiveResume />
            </PageTransition>
          }
        />

        {/* Studio Templates */}
        <Route
          path="/studio/templates"
          element={
            <PageTransition>
              <TemplatesHub />
            </PageTransition>
          }
        />

        {/* Studio Platforms - redirect to /platforms */}
        <Route
          path="/studio/platforms"
          element={
            <PageTransition>
              <PlatformsHub />
            </PageTransition>
          }
        />

        {/* Component Documentation */}
        <Route
          path="/docs/components"
          element={
            <PageTransition>
              <ComponentDocs />
            </PageTransition>
          }
        />

        {/* PWA Install Page */}
        <Route
          path="/install"
          element={
            <PageTransition>
              <Install />
            </PageTransition>
          }
        />

        {/* Services */}
        <Route
          path="/services"
          element={
            <PageTransition>
              <ServicesHub />
            </PageTransition>
          }
        />
        <Route
          path="/services/heuristic"
          element={
            <PageTransition>
              <HeuristicEvaluation />
            </PageTransition>
          }
        />
        <Route
          path="/services/accessibility"
          element={
            <PageTransition>
              <AccessibilityAudit />
            </PageTransition>
          }
        />
        <Route
          path="/services/user-flow"
          element={
            <PageTransition>
              <UserFlowAnalysis />
            </PageTransition>
          }
        />
        <Route
          path="/services/design-review"
          element={
            <PageTransition>
              <DesignSystemReview />
            </PageTransition>
          }
        />
        <Route
          path="/services/performance"
          element={
            <PageTransition>
              <PerformanceTesting />
            </PageTransition>
          }
        />
        <Route
          path="/services/security"
          element={
            <PageTransition>
              <SecurityAssessment />
            </PageTransition>
          }
        />
        <Route
          path="/pricing"
          element={
            <PageTransition>
              <Pricing />
            </PageTransition>
          }
        />
        <Route
          path="/book"
          element={
            <PageTransition>
              <Book />
            </PageTransition>
          }
        />
        <Route
          path="/transparency"
          element={
            <PageTransition>
              <TransparencyReport />
            </PageTransition>
          }
        />
        <Route
          path="/terms"
          element={
            <PageTransition>
              <Terms />
            </PageTransition>
          }
        />
        <Route
          path="/changelog"
          element={
            <PageTransition>
              <Changelog />
            </PageTransition>
          }
        />
        <Route
          path="/privacy"
          element={
            <PageTransition>
              <Privacy />
            </PageTransition>
          }
        />
        <Route
          path="/docs/api"
          element={
            <PageTransition>
              <ApiDocs />
            </PageTransition>
          }
        />

        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <PageTransition>
              <AdminDashboard />
            </PageTransition>
          }
        />
        <Route
          path="/admin/waitlist"
          element={
            <PageTransition>
              <WaitlistManagement />
            </PageTransition>
          }
        />

        {/* Store */}
        <Route
          path="/store/templates"
          element={
            <PageTransition>
              <TemplateMarketplace />
            </PageTransition>
          }
        />
        <Route
          path="/store/services"
          element={
            <PageTransition>
              <ServicesPage />
            </PageTransition>
          }
        />

        {/* Playgrounds */}
        <Route
          path="/playground/librex"
          element={
            <PageTransition>
              <LibrexPlayground />
            </PageTransition>
          }
        />

        {/* Unified Systems */}
        <Route
          path="/scanner"
          element={
            <PageTransition>
              <UnifiedScanner />
            </PageTransition>
          }
        />

        {/* TalAI Product Pages */}
        <Route
          path="/projects/talai/litreview"
          element={
            <PageTransition>
              <LitReviewBot />
            </PageTransition>
          }
        />
        <Route
          path="/projects/talai/grantwriter"
          element={
            <PageTransition>
              <GrantWriter />
            </PageTransition>
          }
        />

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}

export default function App() {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme="quantum">
          <TooltipProvider>
            <BrowserRouter>
              <AppErrorBoundary>
                <SkipToMain />
                <RouteProgressBar />
                <RouteAnnouncer />
                <AnimatePresence mode="wait">
                  <AppRoutes />
                </AnimatePresence>
                <CommandPalette />
                <KeyboardShortcutsHelp />
                <OnboardingTour />
                <NewUserOnboarding />
                <AIConsentModal />
                <Toaster />
              </AppErrorBoundary>
            </BrowserRouter>
          </TooltipProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
}
