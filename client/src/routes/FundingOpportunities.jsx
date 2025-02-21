// src/routes/FundingOpportunities.jsx (all investment opportunities - view all page)
import React from 'react';
import Layout from '../components/common/Layout';
import Funding from '../components/donations/Funding';
import { useNavigate } from "react-router-dom";

const FundingOpportunities = () => {
  const navigate = useNavigate();
  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-8">
         {/* New Back Button */} 
        <div className="flex justify-start mb-4">
          <button type="button" onClick={() => navigate('/donation')}
           className="px-5 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg shadow-lg hover:bg-blue-700 transition">
              ← Back
          </button>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">All Investment Opportunities</h1>
          <p className="text-gray-600">
            Explore all available investment opportunities from our college community.
          </p>
        </div>
        <Funding preview={false} />
      </div>
    </Layout>
  );
};

export default FundingOpportunities;