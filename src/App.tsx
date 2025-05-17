import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import SearchPage from "./pages/SearchPage";
import OpenJobsPage from "./pages/OpenJobsPage";
import { InterviewerDashboard } from "./pages/AiInterviewPage";
import HiredTeamPage from "./pages/HiredTeamPage";
import JobDetailsPage from "./pages/JobDetailsPage";
import CandidateDetailsPage from "./pages/CandidateDetailsPage";
import StudentCall from "./pages/StudentCall";
import StudentLayout from "./components/StudentLayout";
import InterviewListPage from "./components/ai-interview/InterviewListPage";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import VideoInterview from "./pages/VideoInterview";

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* HR routes - require isHR to be true */}
        <Route
          path="/"
          element={
            <ProtectedRoute requireHR={true}>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/search" replace />} />
          <Route path="search" element={<SearchPage />} />
          <Route path="jobs" element={<OpenJobsPage />} />
          <Route path="jobs/:id" element={<JobDetailsPage />} />
          <Route path="ai-interview" element={<InterviewerDashboard />} />
          <Route path="team" element={<HiredTeamPage />} />
          <Route path="candidate/:id" element={<CandidateDetailsPage />} />
        </Route>

        {/* Student routes - require isHR to be false */}
        <Route
          path="/student"
          element={
            <ProtectedRoute requireHR={false}>
              <StudentLayout />
            </ProtectedRoute>
          }
        >
          <Route path="interviews" element={<InterviewListPage />} />
          <Route path="interview/:id" element={<StudentCall />} />
          <Route path="videoInterview/:id" element={<VideoInterview />} />
        </Route>

        {/* Catch all route - redirect to appropriate home page based on role */}
        <Route
          path="*"
          element="/"
        />
      </Routes>
    </AuthProvider>
  );
}

export default App;
