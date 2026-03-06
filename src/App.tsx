import { Suspense, lazy } from "react";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageTransition } from "@/components/layout/PageTransition";
import { OnboardingProvider } from "@/components/onboarding";
import { InstallPrompt, NetworkStatusIndicator, OfflineSyncProvider } from "@/components/pwa";
import { ErrorBoundary, PageLoader } from "@/components/shared";

// Eager load critical routes
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

// Lazy load secondary routes for better initial load
const Inbox = lazy(() => import("./pages/Inbox"));
const Projects = lazy(() => import("./pages/Projects"));
const ProjectDetail = lazy(() => import("./pages/ProjectDetail"));
const RitualView = lazy(() => import("./pages/RitualView"));
const Journal = lazy(() => import("./pages/Journal"));
const Calendar = lazy(() => import("./pages/Calendar"));
const Lists = lazy(() => import("./pages/Lists"));
const Analytics = lazy(() => import("./pages/Analytics"));
const Wiki = lazy(() => import("./pages/Wiki"));
const Install = lazy(() => import("./pages/Install"));
const Privacy = lazy(() => import("./pages/Privacy"));
const Landing = lazy(() => import("./pages/Landing"));
const InviteAccept = lazy(() => import("./pages/InviteAccept"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const AdminErrorLogs = lazy(() => import("./pages/AdminErrorLogs"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 2,
      refetchOnWindowFocus: false, // PWA environment
    },
  },
});

// Wrapper for routes that need AppLayout with page transition
function LayoutRoute({ children }: { children: React.ReactNode }) {
  return (
    <AppLayout>
      <ErrorBoundary>
        <PageTransition>{children}</PageTransition>
      </ErrorBoundary>
    </AppLayout>
  );
}

// Wrapper for immersive routes (no layout) with page transition
function ImmersiveRoute({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary>
      <PageTransition>{children}</PageTransition>
    </ErrorBoundary>
  );
}

// Animated routes component that uses location for AnimatePresence
function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Immersive routes - NO AppLayout */}
        <Route
          path="/ritual"
          element={
            <ImmersiveRoute>
              <Suspense fallback={<PageLoader message="Preparando ritual..." />}>
                <RitualView />
              </Suspense>
            </ImmersiveRoute>
          }
        />
        <Route
          path="/install"
          element={
            <ImmersiveRoute>
              <Suspense fallback={<PageLoader />}>
                <Install />
              </Suspense>
            </ImmersiveRoute>
          }
        />
        <Route
          path="/privacy"
          element={
            <ImmersiveRoute>
              <Suspense fallback={<PageLoader />}>
                <Privacy />
              </Suspense>
            </ImmersiveRoute>
          }
        />
        
        {/* Main App routes WITH AppLayout */}
        <Route path="/app" element={<LayoutRoute><Index /></LayoutRoute>} />
        
        {/* Landing page as root */}
        <Route
          path="/"
          element={
            <ImmersiveRoute>
              <Suspense fallback={<PageLoader />}>
                <Landing />
              </Suspense>
            </ImmersiveRoute>
          }
        />
        <Route
          path="/inbox"
          element={
            <LayoutRoute>
              <Suspense fallback={<PageLoader message="Carregando inbox..." />}>
                <Inbox />
              </Suspense>
            </LayoutRoute>
          }
        />
        <Route
          path="/projects"
          element={
            <LayoutRoute>
              <Suspense fallback={<PageLoader message="Carregando projetos..." />}>
                <Projects />
              </Suspense>
            </LayoutRoute>
          }
        />
        <Route
          path="/projects/:id"
          element={
            <LayoutRoute>
              <Suspense fallback={<PageLoader message="Carregando projeto..." />}>
                <ProjectDetail />
              </Suspense>
            </LayoutRoute>
          }
        />
        <Route
          path="/lists"
          element={
            <LayoutRoute>
              <Suspense fallback={<PageLoader message="Carregando listas..." />}>
                <Lists />
              </Suspense>
            </LayoutRoute>
          }
        />
        <Route
          path="/journal"
          element={
            <LayoutRoute>
              <Suspense fallback={<PageLoader message="Carregando diário..." />}>
                <Journal />
              </Suspense>
            </LayoutRoute>
          }
        />
        <Route
          path="/calendar"
          element={
            <LayoutRoute>
              <Suspense fallback={<PageLoader message="Carregando calendário..." />}>
                <Calendar />
              </Suspense>
            </LayoutRoute>
          }
        />
        <Route
          path="/analytics"
          element={
            <LayoutRoute>
              <Suspense fallback={<PageLoader message="Carregando analytics..." />}>
                <Analytics />
              </Suspense>
            </LayoutRoute>
          }
        />
        
        {/* Invite acceptance */}
        <Route
          path="/invite/:code"
          element={
            <ImmersiveRoute>
              <Suspense fallback={<PageLoader />}>
                <InviteAccept />
              </Suspense>
            </ImmersiveRoute>
          }
        />
        
        {/* Password reset */}
        <Route
          path="/reset-password"
          element={
            <ImmersiveRoute>
              <Suspense fallback={<PageLoader />}>
                <ResetPassword />
              </Suspense>
            </ImmersiveRoute>
          }
        />

        {/* Admin */}
        <Route
          path="/admin/errors"
          element={
            <ImmersiveRoute>
              <Suspense fallback={<PageLoader message="Carregando logs..." />}>
                <AdminErrorLogs />
              </Suspense>
            </ImmersiveRoute>
          }
        />

        {/* Catch-all */}
        <Route path="*" element={<ImmersiveRoute><NotFound /></ImmersiveRoute>} />
      </Routes>
    </AnimatePresence>
  );
}

const App = () => (
  <ErrorBoundary>
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <OfflineSyncProvider>
            <OnboardingProvider>
              <Toaster />
              <Sonner />
              <InstallPrompt />
              <NetworkStatusIndicator />
              <BrowserRouter>
                <AnimatedRoutes />
              </BrowserRouter>
            </OnboardingProvider>
          </OfflineSyncProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  </ErrorBoundary>
);

export default App;
