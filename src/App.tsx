import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { OnboardingProvider, WelcomeModal, TourOverlay, FirstStepsChecklist } from "@/components/onboarding";
import { InstallPrompt, NetworkStatusIndicator, OfflineSyncProvider } from "@/components/pwa";
import Index from "./pages/Index";
import Inbox from "./pages/Inbox";
import Projects from "./pages/Projects";
import ProjectDetail from "./pages/ProjectDetail";
import RitualView from "./pages/RitualView";
import Journal from "./pages/Journal";
import Calendar from "./pages/Calendar";
import Lists from "./pages/Lists";
import Analytics from "./pages/Analytics";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Wrapper for routes that need AppLayout
function LayoutRoute({ children }: { children: React.ReactNode }) {
  return <AppLayout>{children}</AppLayout>;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <OfflineSyncProvider>
        <OnboardingProvider>
          <Toaster />
          <Sonner />
          <InstallPrompt />
          <NetworkStatusIndicator />
          <BrowserRouter>
            <WelcomeModal />
            <TourOverlay />
            <FirstStepsChecklist />
            <Routes>
              {/* Immersive Ritual View - NO AppLayout */}
              <Route path="/ritual" element={<RitualView />} />
              
              {/* Main App routes WITH AppLayout */}
              <Route path="/" element={<LayoutRoute><Index /></LayoutRoute>} />
              <Route path="/inbox" element={<LayoutRoute><Inbox /></LayoutRoute>} />
              <Route path="/projects" element={<LayoutRoute><Projects /></LayoutRoute>} />
              <Route path="/projects/:id" element={<LayoutRoute><ProjectDetail /></LayoutRoute>} />
              <Route path="/lists" element={<LayoutRoute><Lists /></LayoutRoute>} />
              <Route path="/journal" element={<LayoutRoute><Journal /></LayoutRoute>} />
              <Route path="/calendar" element={<LayoutRoute><Calendar /></LayoutRoute>} />
              <Route path="/analytics" element={<LayoutRoute><Analytics /></LayoutRoute>} />
              
              {/* Catch-all */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </OnboardingProvider>
      </OfflineSyncProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;