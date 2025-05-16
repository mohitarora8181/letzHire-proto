import React from "react";
import { Routes, Route } from "react-router-dom";
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

function App() {
  return (
    <Routes>

      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      <Route path="/" element={<Layout />}>
        <Route path="search" element={<SearchPage />} />
        <Route path="jobs" element={<OpenJobsPage />} />
        <Route path="jobs/:id" element={<JobDetailsPage />} />
        <Route path="ai-interview" element={<InterviewerDashboard />} />
        <Route path="team" element={<HiredTeamPage />} />
        <Route path="candidate/:id" element={<CandidateDetailsPage />} />
      </Route>
      <Route path="/student" element={<StudentLayout />}>
        <Route path="interviews" element={<InterviewListPage />} />
        <Route path="interview/:id" element={<StudentCall />} />
        <Route index element={<InterviewListPage />} />
      </Route>
    </Routes>
  );
}

export default App;
