//region imports
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MusicPlayer } from "./components/shared/MusicPlayer";
import ErrorBoundary from "./components/common/ErrorBoundary";
import Home from "./pages/Home";
import Songs from "./pages/Songs";
import Library from "./pages/Library";
import About from "./pages/About";
import Profile from "./pages/Profile";
import Auth from "./pages/Auth";
import VerifyEmail from "./pages/VerifyEmail";
import AdminDashboard from "./components/admin/AdminDashboard";
import NotFound from "./pages/NotFound";
//endregion

//region configuration
/**
 * React Query client configuration
 * Handles API caching and error retry logic
 */
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});
//endregion

//region component
/**
 * Root Application Component
 * Provides global context providers and routing configuration
 */
const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        {/* Toast notifications */}
        <ToastContainer 
          position="bottom-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
        />
        
        {/* Application routes */}
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<ErrorBoundary><Home /></ErrorBoundary>} />
            <Route path="/songs" element={<ErrorBoundary><Songs /></ErrorBoundary>} />
            <Route path="/library" element={<ErrorBoundary><Library /></ErrorBoundary>} />
            <Route path="/about" element={<ErrorBoundary><About /></ErrorBoundary>} />
            <Route path="/profile" element={<ErrorBoundary><Profile /></ErrorBoundary>} />
            <Route path="/auth" element={<ErrorBoundary><Auth /></ErrorBoundary>} />
            <Route path="/verify-email" element={<ErrorBoundary><VerifyEmail /></ErrorBoundary>} />
            <Route path="/admin" element={<ErrorBoundary><AdminDashboard /></ErrorBoundary>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
        
        {/* Global music player */}
        <MusicPlayer />
      </TooltipProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);
//endregion

//region exports
export default App;
//endregion
