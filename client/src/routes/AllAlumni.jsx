// client/src/routes/AllAlumni.jsx
import React, { useState, useEffect } from 'react';
import Layout from '../components/common/Layout';
import ProfileCard from '../components/network/ProfileCard';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Pagination from '../components/common/Pagination'; // Import the pagination component

const AllAlumni = () => {
  const [alumni, setAlumni] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filter state variables
  const [batch, setBatch] = useState('');
  const [branch, setBranch] = useState('');
  const [currentCompany, setCurrentCompany] = useState('');
  const [location, setLocation] = useState('');

  const navigate = useNavigate();
  const limit = 10; // Number of profiles per page

  const fetchAlumni = async (pageNum = 1, filters = {}) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      // Use provided filters if present, otherwise fall back to state values
      const effectiveBatch = filters.batch !== undefined ? filters.batch : batch;
      const effectiveBranch = filters.branch !== undefined ? filters.branch : branch;
      const effectiveCurrentCompany = filters.currentCompany !== undefined ? filters.currentCompany : currentCompany;
      const effectiveLocation = filters.location !== undefined ? filters.location : location;
      
      if (effectiveBatch) params.append('batch', effectiveBatch);
      if (effectiveBranch) params.append('branch', effectiveBranch);
      if (effectiveCurrentCompany) params.append('currentCompany', effectiveCurrentCompany);
      if (effectiveLocation) params.append('location', effectiveLocation);
      
      // Add pagination parameters
      params.append('page', pageNum);
      params.append('limit', limit);
      
      const url = `${import.meta.env.VITE_API_BASE_URL}/api/alumni?${params.toString()}`;
      const response = await axios.get(url);
      setAlumni(response.data.data);
      setTotal(response.data.total);
      setPage(response.data.page);
      setPages(response.data.pages);
      setLoading(false);
    } catch (err) {
      setError('Error fetching alumni profiles');
      setLoading(false);
    }
  };
  

  useEffect(() => {
    fetchAlumni();
  }, []);

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    fetchAlumni(1);
  };

 const handleClearFilters = () => {
  // Immediately update state (optional)
  setBatch('');
  setBranch('');
  setCurrentCompany('');
  setLocation('');
  // Call fetchAlumni with empty filters
  fetchAlumni(1, {
    batch: '',
    branch: '',
    currentCompany: '',
    location: ''
  });
};

  

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > pages) return;
    fetchAlumni(newPage);
  };

  if (loading) return <div>Loading alumni profiles...</div>;
  if (error) return <div className="text-red-600">{error}</div>;

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
          <h1 className="text-3xl font-bold text-gray-800 mb-4">All Alumni</h1>
          <p className="text-gray-600 mb-4">Explore all our distinguished alumni profiles.</p>
          {/* Filter Form */}
          <form onSubmit={handleFilterSubmit} className="flex flex-wrap gap-4 mb-6">
            <div>
              <label className="block text-gray-700">Batch Year</label>
              <input 
                type="text" 
                value={batch} 
                onChange={(e) => setBatch(e.target.value)} 
                placeholder="e.g. 2022" 
                className="border px-2 py-1 rounded"
              />
            </div>
            <div>
              <label className="block text-gray-700">Branch</label>
              <select 
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
                className="border px-2 py-1 rounded"
              >
                <option value="">All</option>
                <option value="CSE">CSE</option>
                <option value="CSD">CSD</option>
                <option value="CSH">CSH</option>
                <option value="CSA">CSA</option>
                <option value="ECE">ECE</option>
                <option value="ECI">ECI</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-700">Current Company</label>
              <input 
                type="text"
                value={currentCompany}
                onChange={(e) => setCurrentCompany(e.target.value)}
                placeholder="Company name"
                className="border px-2 py-1 rounded"
              />
            </div>
            <div>
              <label className="block text-gray-700">Location</label>
              <input 
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Location"
                className="border px-2 py-1 rounded"
              />
            </div>
            <div className="flex items-end gap-2">
              <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                Apply Filters
              </button>
              <button type="button" onClick={handleClearFilters} className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
                Clear Filters
              </button>
            </div>
          </form>
        </div>
        
        {/* Alumni Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {alumni.map((profile) => (
            <ProfileCard key={profile._id} profile={profile} />
          ))}
        </div>
        
        {/* Pagination Controls */}
        <Pagination currentPage={page} totalPages={pages} onPageChange={handlePageChange} />
      </div>
    </Layout>
  );
};

export default AllAlumni;
