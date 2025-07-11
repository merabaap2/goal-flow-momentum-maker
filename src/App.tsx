import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { SplashLoader } from "./components/SplashLoader";
import { GoalWizard } from "./components/GoalWizard/GoalWizard";
import { SimpleGoalWizard } from "./components/GoalWizard/SimpleGoalWizard";
import { AuthPage } from "./pages/AuthPage";
import { AppProvider } from "./context/AppContext";
import { GoalsOverviewPage } from "./pages/GoalsOverviewPage";
import { GoalsSuccessPage } from "./pages/GoalsSuccessPage";
import { GoalsFailedPage } from "./pages/GoalsFailedPage";
import { RDMRewardsEarnedPage } from "./pages/RDMRewardsEarnedPage";
import { RDMRewardsGivenPage } from "./pages/RDMRewardsGivenPage";
import { RDMRemorseBucketPage } from "./pages/RDMRemorseBucketPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AppProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navigate to="/auth" replace />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/splash" element={<SplashLoader />} />
            <Route path="/home" element={<Index />} />
            <Route path="/wizard" element={<GoalWizard />} />
            <Route path="/simple-wizard" element={<SimpleGoalWizard />} />
            <Route path="/goals-overview" element={<GoalsOverviewPage />} />
            <Route path="/goals-success" element={<GoalsSuccessPage />} />
            <Route path="/goals-failed" element={<GoalsFailedPage />} />
            <Route path="/rdm-rewards-earned" element={<RDMRewardsEarnedPage />} />
            <Route path="/rdm-rewards-given" element={<RDMRewardsGivenPage />} />
            <Route path="/rdm-remorse-bucket" element={<RDMRemorseBucketPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AppProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
