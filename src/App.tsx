import React from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import SearchPage from "./pages/SearchPage";
import OpenJobsPage from "./pages/OpenJobsPage";
import { InterviewerDashboard } from "./pages/AiInterviewPage";
import HiredTeamPage from "./pages/HiredTeamPage";
import JobDetailsPage from "./pages/JobDetailsPage";
import CandidateDetailsPage from "./pages/CandidateDetailsPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path="search" element={<SearchPage />} />
        <Route path="jobs" element={<OpenJobsPage />} />
        <Route path="jobs/:id" element={<JobDetailsPage />} />
        <Route path="ai-interview" element={<InterviewerDashboard />} />
        <Route path="team" element={<HiredTeamPage />} />
        <Route path="candidate/:id" element={<CandidateDetailsPage />} />
      </Route>
    </Routes>
  );
}

export default App;
