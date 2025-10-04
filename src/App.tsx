import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Connections from "./pages/Connections";
import Groups from "./pages/Groups";
import GradesTracker from "./pages/GradesTracker";
import Calendar from "./pages/Calendar";
import Tasks from "./pages/Tasks";
import Resources from "./pages/Resources";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import { Navbar } from "./components/layout/Navbar";

const queryClient = new QueryClient();

const DashboardLayout = ({ children }: { children: JSX.Element }) => (
  <div className="min-h-screen bg-background">
    <Navbar />
    {children}
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/dashboard" element={<DashboardLayout><Dashboard /></DashboardLayout>} />
            <Route path="/connections" element={<DashboardLayout><Connections /></DashboardLayout>} />
            <Route path="/groups" element={<DashboardLayout><Groups /></DashboardLayout>} />
            <Route path="/grades" element={<DashboardLayout><GradesTracker /></DashboardLayout>} />
            <Route path="/calendar" element={<DashboardLayout><Calendar /></DashboardLayout>} />
            <Route path="/tasks" element={<DashboardLayout><Tasks /></DashboardLayout>} />
            <Route path="/resources" element={<DashboardLayout><Resources /></DashboardLayout>} />
            <Route path="/profile" element={<DashboardLayout><Profile /></DashboardLayout>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
