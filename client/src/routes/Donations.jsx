// src/routes/Donations.jsx
import React from 'react';
import Layout from '../components/common/Layout';
import Donation from '../components/donations/Donation';
import Funding from '../components/donations/Funding';

const Donations = () => {
  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Support Our Institution
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Join our community of alumni and supporters in making a lasting impact.
            Your contribution helps us build a stronger institution for future generations.
          </p>
        </div>
        <Donation />
        <Funding />
      </div>
    </Layout>
  );
};

export default Donations;