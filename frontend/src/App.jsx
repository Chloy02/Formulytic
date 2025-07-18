// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext'; // Import AuthProvider
import LandingPage from './LandingPage';
import SignUpPage from './SignUpPage';
import SignInPage from './SignInPage';
import QuestionnairePage from './QuestionnairePage'; // Import QuestionnairePage
import AdminDashboardPage from './AdminDashboardPage';

function App() {
  return (
    <Router>
      <AuthProvider> {/* <<< Wrap your Routes with AuthProvider */}
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/signin" element={<SignInPage />} />
          <Route path="/questionnaire" element={<QuestionnairePage />} />
          <Route path="/AdminDashboard" element={<AdminDashboardPage />} /> {/* <<< NEW ROUTE for questionnaire */}
          {/* Add more routes here for other pages like /forgot-password, /terms, /privacy */}
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;