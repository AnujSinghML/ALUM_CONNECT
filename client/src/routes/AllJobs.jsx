// client/src/routes/AllJobs.jsx
import React, { useState, useEffect } from 'react';
import Layout from '../components/common/Layout';
import JobCard from '../components/network/JobCard';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AllJobs = () => {
  const navigate = useNavigate();
  // Filter state variables
  const [employmentType, setEmploymentType] = useState('');
  const [location, setLocation] = useState('');
  const [tag, setTag] = useState('');
  const [keyword, setKeyword] = useState('');

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Modified fetch function accepts an optional filters object
  const fetchFilteredJobs = async (pageNum = 1, filters = {}) => {
    setLoading(true);
    try {
      // Use passed-in filters if available; otherwise, use state values
      const effectiveEmploymentType = filters.employmentType !== undefined ? filters.employmentType : employmentType;
      const effectiveLocation = filters.location !== undefined ? filters.location : location;
      const effectiveTag = filters.tag !== undefined ? filters.tag : tag;
      const effectiveKeyword = filters.keyword !== undefined ? filters.keyword : keyword;

      const queryParams = new URLSearchParams();
      if (effectiveEmploymentType) queryParams.append('employmentType', effectiveEmploymentType);
      if (effectiveLocation) queryParams.append('location', effectiveLocation);
      if (effectiveTag) queryParams.append('tag', effectiveTag);
      if (effectiveKeyword) queryParams.append('keyword', effectiveKeyword);

      // Build URL: if no filters, use base URL without "?"
      const url = queryParams.toString()
        ? `http://localhost:3000/api/jobs/filter?${queryParams.toString()}`
        : `http://localhost:3000/api/jobs/filter`;

      const response = await axios.get(url);
      setJobs(response.data);
      setLoading(false);
    } catch (err) {
      setError('Error fetching jobs');
      setLoading(false);
    }
  };

  // Initial fetch on component mount
  useEffect(() => {
    fetchFilteredJobs();
  }, []);

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    fetchFilteredJobs();
  };

  const handleClearFilters = () => {
    // Immediately clear state values
    setEmploymentType('');
    setLocation('');
    setTag('');
    setKeyword('');
    // Fetch unfiltered jobs by explicitly passing empty filters
    fetchFilteredJobs(1, {
      employmentType: '',
      location: '',
      tag: '',
      keyword: ''
    });
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Back Button */}
        <div className="flex justify-start mb-4">
          <button
            type="button"
            onClick={() => navigate('/network')}
            className="px-5 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg shadow-lg hover:bg-blue-700 transition"
          >
            ← Back
          </button>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">All Job Opportunities</h1>
          <p className="text-gray-600">
            Explore all available job opportunities.
          </p>
        </div>

        {/* Filter Form */}
        <form onSubmit={handleFilterSubmit} className="mb-6 flex flex-wrap gap-4">
          <select
            value={employmentType}
            onChange={(e) => setEmploymentType(e.target.value)}
            className="px-3 py-2 border rounded"
          >
            <option value="">All Types</option>
            <option value="full-time">Full-time</option>
            <option value="part-time">Part-time</option>
            <option value="contract">Contract</option>
            <option value="internship">Internship</option>
            <option value="freelance">Freelance</option>
          </select>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Location"
            className="px-3 py-2 border rounded"
          />
          <input
            type="text"
            value={tag}
            onChange={(e) => setTag(e.target.value)}
            placeholder="Tag"
            className="px-3 py-2 border rounded"
          />
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Search keyword"
            className="px-3 py-2 border rounded"
          />
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
            Filter
          </button>
          {/* Clear All Filters Button */}
          <button
            type="button"
            onClick={handleClearFilters}
            className="bg-gray-500 text-white px-4 py-2 rounded"
          >
            Clear All Filters
          </button>
        </form>

        {loading ? (
          <div>Loading...</div>
        ) : error ? (
          <div className="text-red-600">{error}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {jobs.map((job, index) => (
              <JobCard key={index} {...job} />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default AllJobs;
