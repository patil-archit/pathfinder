import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Assessment from "./pages/Assessment";
import AIAssessment from "./pages/AIAssessment";
import CareerRoadmap from "./pages/CareerRoadmap";
import OAuthCallback from "./pages/OAuthCallback";
import AssessmentHistory from "./pages/AssessmentHistory";
import Profile from "./pages/Profile";

function App() {
  return (
    <div className="w-full min-h-screen">
      <BrowserRouter>
        <AuthProvider>
          <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/assessment" element={<AIAssessment />} />
          <Route path="/assessment-legacy" element={<Assessment />} />
          <Route path="/assessment-history" element={<AssessmentHistory />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/career-roadmap" element={<CareerRoadmap />} />
          <Route path="/auth/callback" element={<OAuthCallback />} />
          <Route path="/auth/google/callback" element={<OAuthCallback />} />
          <Route path="/auth/github/callback" element={<OAuthCallback />} />
          <Route path="/auth/linkedin/callback" element={<OAuthCallback />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
