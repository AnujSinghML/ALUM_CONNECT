import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Landing page components
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Services from './components/Services';
import Footer from './components/Footer';

// Routes
import Login from './routes/Login';

// Create a Landing page component that combines all landing page components
const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
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
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;