import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Component/Login';
import Register from './Component/Register';
import CandidateDashboard from './Component/Candidate/CandidateDashboard';
import Forgotpassword from './Component/Forgotpassword';
import VerifyOtp from './Component/VerifyOtp';
import ChangePassword from './Component/ChangePassword';
import CandidateInfo from './Component/Candidate/CandidateInfo';
import ViewJob from './Component/Candidate/ViewJob';
import AdminDashboard from './Component/Admin/AdminDashboard';
import ViewApplications from './Component/Admin/ViewApplications';
import CreateJob from './Component/Admin/CreateJob';
import ViewCandidate from './Component/Admin/ViewCandidate';

function App() {
  return (
    <Router>
      <Routes>
        {/* auth paths */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<Forgotpassword />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        <Route path="/change-password" element={<ChangePassword />} />
        {/* candidate paths */}
        <Route path="/candidate-info/:user" element={<CandidateInfo />} />
        <Route path="/candidate/:user" element={<CandidateDashboard />} />
        <Route path="/view-job/:jobId" element={<ViewJob />} />
        {/* admin paths */}
        <Route path="/admin/:user" element={<AdminDashboard />} />
        <Route path="/view-applications/:jobId" element={<ViewApplications />} />
        <Route path="/create-job" element={<CreateJob />} />
        <Route path="/view-candidate/:candidateId" element={<ViewCandidate />} />

      </Routes>
    </Router>
  )
}

export default App