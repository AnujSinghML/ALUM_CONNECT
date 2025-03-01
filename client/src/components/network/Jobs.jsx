// client/src/components/network/Jobs.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import JobCard from './JobCard';

const Jobs = ({ preview = false }) => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/jobs`);
        setJobs(response.data);
        setLoading(false);
      } catch (err) {
        setError('Error loading job opportunities');
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }
  
  if (error) {
    return <div className="text-red-600">{error}</div>;
  }

  // Show only a few jobs in preview mode
  const displayedJobs = preview ? jobs.slice(0, 2) : jobs;

  return (
    <div className="h-full bg-white rounded-lg shadow-md p-6 mt-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Job Opportunities</h2>
        {preview && (
          <button
            onClick={() => navigate('/network/all-jobs')}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            View All Jobs →
          </button>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {displayedJobs.map((job, index) => (
          <JobCard key={index} {...job} />
        ))}
      </div>
      <div className="flex justify-end mt-6">
        <button
          onClick={() => navigate('/network/create-job')}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
        >
          Create Job Opportunity
        </button>
      </div>
    </div>
  );
};

export default Jobs;
