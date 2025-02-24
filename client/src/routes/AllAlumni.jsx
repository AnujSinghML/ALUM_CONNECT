// client/src/routes/AllAlumni.jsx
import React, { useState, useEffect } from 'react';
import Layout from '../components/common/Layout';
import ProfileCard from '../components/network/ProfileCard';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AllAlumni = () => {
  const [alumni, setAlumni] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filter state variables
  const [batch, setBatch] = useState('');
  const [branch, setBranch] = useState('');
  const [currentCompany, setCurrentCompany] = useState('');
  const [location, setLocation] = useState('');

  const navigate = useNavigate();

  const fetchAlumni = async () => {
    setLoading(true);
    try {
      // Build query string based on filter values
      const params = new URLSearchParams();
      if (batch) params.append('batch', batch);
      if (branch) params.append('branch', branch);
      if (currentCompany) params.append('currentCompany', currentCompany);
      if (location) params.append('location', location);

      const url = params.toString()
        ? `http://localhost:3000/api/alumni?${params.toString()}`
        : 'http://localhost:3000/api/alumni';
      const response = await axios.get(url);
      setAlumni(response.data);
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
    fetchAlumni();
  };

  const handleClearFilters = () => {
    setBatch('');
    setBranch('');
    setCurrentCompany('');
    setLocation('');
    fetchAlumni();
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
      </div>
    </Layout>
  );
};

export default AllAlumni;
