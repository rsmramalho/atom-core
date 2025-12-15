import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import Index from "./pages/Index";
import Inbox from "./pages/Inbox";
import Projects from "./pages/Projects";
import ProjectDetail from "./pages/ProjectDetail";
import RitualView from "./pages/RitualView";
import Journal from "./pages/Journal";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Wrapper for routes that need AppLayout
function LayoutRoute({ children }: { children: React.ReactNode }) {
  return <AppLayout>{children}</AppLayout>;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Immersive Ritual View - NO AppLayout */}
          <Route path="/ritual" element={<RitualView />} />
          
          {/* Main App routes WITH AppLayout */}
          <Route path="/" element={<LayoutRoute><Index /></LayoutRoute>} />
          <Route path="/inbox" element={<LayoutRoute><Inbox /></LayoutRoute>} />
          <Route path="/projects" element={<LayoutRoute><Projects /></LayoutRoute>} />
          <Route path="/projects/:id" element={<LayoutRoute><ProjectDetail /></LayoutRoute>} />
          <Route path="/journal" element={<LayoutRoute><Journal /></LayoutRoute>} />
          
          {/* Catch-all */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;