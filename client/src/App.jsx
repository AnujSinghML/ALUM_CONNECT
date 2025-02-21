import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Landing page components
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Services from './components/Services';
import Footer from './components/Footer';

// Routes
import Login from './routes/Login';
import ProtectedRoute from './components/ProtectedRoute';
import Announcement from './routes/Announcement';
import Network from './routes/Network';
import Discussion from './routes/Discussion';
import Donations from './routes/Donations';
import Profile from './routes/Profile';

// New Donation-related routes
import DonationProcess from './routes/DonationProcess';
import CreateFundingRequest from './routes/CreateFundingRequest';

// Landing page component
const LandingPage = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="pt-5">
        <Hero />
        <Services />
      </div>
      <Footer />
    </div>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />

        {/* Secure Routes */}
        <Route path="/announcements" element={<ProtectedRoute><Announcement /></ProtectedRoute>} />
        <Route path="/network" element={<ProtectedRoute><Network /></ProtectedRoute>} />
        <Route path="/discussion" element={<ProtectedRoute><Discussion /></ProtectedRoute>} />
        <Route path="/donation" element={<ProtectedRoute><Donations /></ProtectedRoute>} />
        <Route path="/donation/process" element={<ProtectedRoute><DonationProcess /></ProtectedRoute>} />
        <Route path="/donation/create-funding-request" element={<ProtectedRoute><CreateFundingRequest /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;