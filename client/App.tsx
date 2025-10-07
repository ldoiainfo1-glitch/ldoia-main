import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "./contexts/LanguageContext";

// Main Pages
import Index from "./pages/Index";
// import Register from "./pages/Register";

// LDOAI Pages
import LDOAIAbout from "./pages/LDOAIAbout";
import LDOAICommittee from "./pages/LDOAICommittee";
import LDOAIBenefits from "./pages/LDOAIBenefits";
import Gallery from "./pages/Gallery";
import ContactPage from "./pages/ContactPage";
import NotFound from "./pages/NotFound";
import PromotionPage from "./pages/PromotionPage";

// Super Admin
import SuperAdminDashboard from "./superadmin/SuperAdminDashboard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <LanguageProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Main LDOAI Website Routes */}
            <Route path="/" element={<Index />} />
            
            {/* LDOAI Specific Routes */}
            <Route path="/ldoai" element={<Index />} />
            <Route path="/ldoai/about" element={<LDOAIAbout />} />
            <Route path="/ldoai/benefits" element={<LDOAIBenefits />} />
            <Route path="/ldoai/committee" element={<LDOAICommittee />} />
            {/* <Route path="/ldoai/apply" element={<Register />} /> */}
            
            {/* General Pages */}
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/promotion" element={<PromotionPage />} />
            
            {/* Super Admin Panel */}
            <Route path="/superadmin" element={<SuperAdminDashboard />} />
            
            {/* Catch-all route for 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </LanguageProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
