import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Services from './components/Services';
import Footer from './components/Footer';

const App = () => {
  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <Navbar />
      <Hero />
      <Services />
      <Footer />
    </div>
  );
};

export default App;
