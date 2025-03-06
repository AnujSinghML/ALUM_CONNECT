// src/routes/FundingOpportunities.jsx
import React, { useState } from 'react';
import Layout from '../../components/common/Layout';
import Funding from '../../components/donations/Funding';
import { useNavigate } from "react-router-dom";

const FundingOpportunities = () => {
  const navigate = useNavigate();
  
  // Filter state for category and search keyword
  const [filter, setFilter] = useState({ category: '', search: '' });
  const [appliedFilter, setAppliedFilter] = useState({});

  // Handle change in filter inputs
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter(prev => ({ ...prev, [name]: value }));
  };

  // Apply filters (update appliedFilter which is passed to Funding)
  const applyFilters = () => {
    setAppliedFilter(filter);
  };

  // Clear filters in one go
  const clearFilters = () => {
    setFilter({ category: '', search: '' });
    setAppliedFilter({});
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Back Button */}
        <div className="flex justify-start mb-4">
          <button 
            type="button" 
            onClick={() => navigate('/donation')}
            className="px-5 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg shadow-lg hover:bg-blue-700 transition"
          >
            ← Back
          </button>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">All Investment Opportunities</h1>
          <p className="text-gray-600">
            Explore all available investment opportunities from our college community.
          </p>
        </div>
        
        {/* Filter Section */}
        <div className="mb-6 p-4 bg-gray-100 rounded-lg">
          <div className="flex flex-wrap gap-4 items-end">
            <div>
              <label className="block text-gray-700">Category:</label>
              <select 
                name="category" 
                value={filter.category}
                onChange={handleFilterChange}
                className="mt-1 p-2 border rounded"
              >
                <option value="">All</option>
                <option value="startup">Startup</option>
                <option value="research">Research</option>
                <option value="innovation">Innovation</option>
                <option value="patent">Patent</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-700">Search:</label>
              <input 
                type="text"
                name="search"
                value={filter.search}
                onChange={handleFilterChange}
                placeholder="Keyword..."
                className="mt-1 p-2 border rounded"
              />
            </div>
            <div className="flex gap-2">
              <button 
                onClick={applyFilters}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Apply Filters
              </button>
              <button 
                onClick={clearFilters}
                className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>
        
        {/* Funding component receives applied filters */}
        <Funding preview={false} filter={appliedFilter} />
      </div>
    </Layout>
  );
};

export default FundingOpportunities;
