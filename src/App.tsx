import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Jobs from "./pages/Jobs";
import TimeTracking from "./pages/TimeTracking";
import Photos from "./pages/Photos";
import Calendar from "./pages/Calendar";
import Navbar from "./components/layout/Navbar";
import MobileNavigation from "./components/layout/MobileNavigation";
import NotFound from "./pages/NotFound";
import { useKeyboardShortcuts } from "./hooks/useKeyboardShortcuts";
import "./i18n";

const queryClient = new QueryClient();

function AppContent() {
  useKeyboardShortcuts();
  
  return (
    <div className="min-h-screen bg-background">
      {/* Skip to content link for accessibility */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary text-primary-foreground px-4 py-2 rounded-md z-50"
      >
        Przejdź do treści
      </a>
      
      <Navbar />
      <main id="main-content" className="pb-20 md:pb-0">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/time-tracking" element={<TimeTracking />} />
          <Route path="/photos" element={<Photos />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/estimates" element={<div className="p-4 md:p-8"><h1 className="text-2xl font-poppins">Kosztorysy - W przygotowaniu</h1></div>} />
          <Route path="/reports" element={<div className="p-4 md:p-8"><h1 className="text-2xl font-poppins">Raporty - W przygotowaniu</h1></div>} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <MobileNavigation />
    </div>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="system" storageKey="fachowiec-ui-theme">
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
