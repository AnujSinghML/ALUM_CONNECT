import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Landing page components
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Services from './components/Services';
import Footer from './components/Footer';

// Routes
import Login from './routes/Login';
import Announcement from './routes/Announcement';
import Network from './routes/Network';
import Discussion from './routes/Discussion';
import Donation from './routes/Donation';
import Profile from './routes/Profile';

// Landing page component
const LandingPage = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="pt-20">
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
        {/* Public routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        
        {/* Main routes */}
        <Route path="/announcements" element={<Announcement />} />
        <Route path="/network" element={<Network />} />
        <Route path="/discussion" element={<Discussion />} />
        <Route path="/donation" element={<Donation />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;