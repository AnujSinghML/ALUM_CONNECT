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
import AdminAnnouncements from './routes/AdminAnnouncements';
import Network from './routes/Network';
import Discussion from './routes/Discussion';
import Donations from './routes/Donations';
import Profile from './routes/Profile';
import AllAlumni from './routes/AllAlumni';
import AllAchievements from './routes/AllAchievements';
import AllEvents from './routes/AllEvents';
import CreateAchievement from './routes/CreateAchievement';

// Donation-related routes
import DonationProcess from './routes/DonationProcess';
import CreateFundingRequest from './routes/CreateFundingRequest';
import FundingOpportunities from './routes/FundingOpportunities';

// New Job-related routes
import AllJobs from './routes/AllJobs';
import CreateJobOpportunity from './routes/CreateJobOpportunity';

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
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />

        {/* Protected Routes */}
        <Route 
          path="/announcements" 
          element={
            <ProtectedRoute>
              <Announcement />
            </ProtectedRoute>
          } 
        />

        {/* Admin Panel (1) - Already existing */}
        <Route 
          path="/admin/announcements" 
          element={
            <ProtectedRoute>
              <AdminAnnouncements />
            </ProtectedRoute>
          } 
        />

        {/* Admin Panel (2) - New /admin/dashboard route */}
        <Route 
          path="/admin/dashboard" 
          element={
            <ProtectedRoute>
              <AdminAnnouncements />
            </ProtectedRoute>
          } 
        />

        {/* Network */}
        <Route 
          path="/network" 
          element={
            <ProtectedRoute>
              <Network />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/network/all-people" 
          element={
            <ProtectedRoute>
              <AllAlumni />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/network/all-jobs" 
          element={
            <ProtectedRoute>
              <AllJobs />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/network/create-job" 
          element={
            <ProtectedRoute>
              <CreateJobOpportunity />
            </ProtectedRoute>
          } 
        />

        {/* Discussion */}
        <Route 
          path="/discussion" 
          element={
            <ProtectedRoute>
              <Discussion />
            </ProtectedRoute>
          } 
        />

        {/* Donations */}
        <Route 
          path="/donation" 
          element={
            <ProtectedRoute>
              <Donations />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/donation/process" 
          element={
            <ProtectedRoute>
              <DonationProcess />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/donation/create-funding-request" 
          element={
            <ProtectedRoute>
              <CreateFundingRequest />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/donation/opportunities" 
          element={
            <ProtectedRoute>
              <FundingOpportunities />
            </ProtectedRoute>
          } 
        />

        {/* Profile */}
        <Route 
          path="/profile" 
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } 
        />

        {/* Announcements - Subpages */}
        <Route path="/announcements/all-events" element={<AllEvents />} />
        <Route path="/announcements/all-achievements" element={<AllAchievements />} />

        {/* Create Achievement */}
        <Route 
          path="/create-achievement" 
          element={
            <ProtectedRoute>
              <CreateAchievement />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
