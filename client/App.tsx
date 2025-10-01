import "./global.css";

import { createRoot } from "react-dom/client";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { DistributorProvider } from "@/hooks/use-distributor";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import TeamChat from "./pages/TeamChat";
import Inbox from "./pages/Inbox";
import Distributor from "./pages/Distributor";
import SalesTracker from "./pages/SalesTracker";
import TeamManagement from "./pages/TeamManagement";
import Settings from "./pages/Settings";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <DistributorProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/login" element={<Auth />} />
            <Route path="/register" element={<Auth />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/team-chat" element={<TeamChat />} />
            <Route path="/inbox" element={<Inbox />} />
            <Route path="/distributor" element={<Distributor />} />
            <Route path="/sales-tracker" element={<SalesTracker />} />
            <Route path="/team-management" element={<TeamManagement />} />
            <Route path="/settings" element={<Settings />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </DistributorProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
