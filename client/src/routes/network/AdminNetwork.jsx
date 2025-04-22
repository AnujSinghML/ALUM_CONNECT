// client/src/routes/AdminNetwork.jsx
import React, { useState, useEffect } from 'react';
import Layout from '../../components/common/Layout';
import axios from 'axios';
import { CheckCircle2, XCircle, Trash2, Filter, PlusCircle } from 'lucide-react';
import { useSidebarLayout } from '../../hooks/useSidebarLayout';
import { useNavigate } from 'react-router-dom';

const AdminNetwork = () => {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    type: '',
    location: '',
    status: '',
    keyword: ''
  });
  const navigate = useNavigate();

  useSidebarLayout(true);

  // Fetch all jobs from the admin endpoint
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_backend_URL}/api/jobs/admin`,
          { withCredentials: true }
        );
        console.log("Admin jobs fetched:", res.data);
        setJobs(res.data);
        setFilteredJobs(res.data);
      } catch (err) {
        console.error('Error fetching admin jobs:', err);
        setError('Failed to load admin network data');
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  // Apply filters
  useEffect(() => {
    if (jobs.length) {
      applyFilters();
    }
  }, [filters, jobs]);

  const applyFilters = () => {
    let result = [...jobs];
    
    // Apply type filter
    if (filters.type) {
      result = result.filter(job => 
        job.employmentType.toLowerCase() === filters.type.toLowerCase()
      );
    }
    
    // Apply location filter
    if (filters.location) {
      result = result.filter(job => 
        job.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }
    
    // Apply status filter
    if (filters.status) {
      result = result.filter(job => 
        job.status === filters.status
      );
    }
    
    // Apply keyword search
    if (filters.keyword) {
      const keyword = filters.keyword.toLowerCase();
      result = result.filter(job => 
        job.title.toLowerCase().includes(keyword) ||
        job.company.toLowerCase().includes(keyword) ||
        job.description.toLowerCase().includes(keyword)
      );
    }
    
    setFilteredJobs(result);
  };

  // Handle filter application
  const handleFilterApply = () => {
    applyFilters();
  };

  // Reset all filters
  const resetFilters = () => {
    setFilters({
      type: '',
      location: '',
      status: '',
      keyword: ''
    });
  };

  // Navigate to Create Job Page
  const navigateToCreateJob = () => {
    navigate('/admin/create-job');
  };

  // Accept: update job status to "active"
  const handleAccept = async (jobId) => {
    try {
      const res = await axios.patch(
        `${import.meta.env.VITE_backend_URL}/api/jobs/admin/${jobId}/status`,
        { status: 'active' },
        { withCredentials: true }
      );
      const updatedJobs = jobs.map((job) => 
        job._id === jobId ? res.data.data : job
      );
      setJobs(updatedJobs);
      setFilteredJobs(prev => 
        prev.map((job) => job._id === jobId ? res.data.data : job)
      );
    } catch (err) {
      console.error('Error accepting job:', err);
      setError('Failed to accept job.');
    }
  };

  // Reject: delete the job from the database
  const handleReject = async (jobId) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_backend_URL}/api/jobs/admin/${jobId}`,
        { withCredentials: true }
      );
      const updatedJobs = jobs.filter((job) => job._id !== jobId);
      setJobs(updatedJobs);
      setFilteredJobs(prev => prev.filter((job) => job._id !== jobId));
    } catch (err) {
      console.error('Error rejecting job:', err);
      setError('Failed to reject job.');
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <p className="text-blue-600 font-medium">Loading Admin Network data...</p>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="text-center p-8 text-red-500">{error}</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Admin Network</h1>
            <span className="text-gray-500 text-sm">
              {filteredJobs.length} {filteredJobs.length === 1 ? 'job' : 'jobs'} found
            </span>
          </div>
          
          <button
            onClick={navigateToCreateJob}
            className="flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
          >
            <PlusCircle size={18} />
            Add New Job Opportunity
          </button>
        </div>

        {/* Filters */}
        <JobFilters 
          filters={filters}
          setFilters={setFilters}
          handleFilterApply={handleFilterApply}
          resetFilters={resetFilters}
        />

        {filteredJobs.length === 0 ? (
          <div className="bg-white rounded-xl shadow p-8 text-center">
            <p className="text-gray-600 mb-4">No job opportunities found.</p>
            <button 
              onClick={navigateToCreateJob}
              className="text-blue-600 font-medium hover:underline"
            >
              Create your first job opportunity
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredJobs.map((job) => (
              <div
                key={job._id}
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition-transform duration-300 transform hover:scale-105 p-6 flex flex-col justify-between"
              >
                {/* Job Info */}
                <div>
                  <div className="mb-4 h-12 w-12 bg-gray-100 rounded-full flex items-center justify-center">
                    <span className="text-gray-400 text-sm">Logo</span>
                  </div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-1">
                    {job.title}
                  </h2>
                  <p className="text-sm text-gray-600">
                    {job.company} • {job.location}
                  </p>
                  <div className="mt-2 text-sm text-gray-500 space-y-1">
                    <p>
                      Type: <span className="font-medium">{job.employmentType}</span>
                    </p>
                    {job.salary && (
                      <p>
                        Salary: <span className="font-medium">{job.salary}</span>
                      </p>
                    )}
                  </div>
                  <p className="mt-2 text-sm text-gray-500 line-clamp-3">
                    {job.description}
                  </p>
                </div>

                {/* Job Status Badge */}
                <div className="mt-4">
                  <StatusBadge status={job.status} />
                </div>

                {/* Action Buttons */}
                <div className="mt-4 flex items-center gap-3">
                  {job.status === 'pending' ? (
                    <>
                      <button
                        onClick={() => handleAccept(job._id)}
                        className="flex items-center gap-1 px-3 py-1 rounded-md bg-green-600 text-white hover:bg-green-700 text-sm"
                      >
                        <CheckCircle2 size={16} />
                        Accept
                      </button>
                      <button
                        onClick={() => handleReject(job._id)}
                        className="flex items-center gap-1 px-3 py-1 rounded-md bg-red-600 text-white hover:bg-red-700 text-sm"
                      >
                        <XCircle size={16} />
                        Reject
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => handleReject(job._id)}
                      className="flex items-center gap-1 px-3 py-1 rounded-md bg-gray-600 text-white hover:bg-gray-700 text-sm"
                    >
                      <Trash2 size={16} />
                      Delete
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

// Filter component for AdminNetwork.jsx
const JobFilters = ({ filters, setFilters, handleFilterApply, resetFilters }) => {
  // Job types for dropdown
  const jobTypes = ['Full-time', 'Part-time', 'Contract', 'Internship', 'Remote'];
  
  // Job statuses for dropdown
  const jobStatuses = ['pending', 'active', 'filled', 'expired'];
  
  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };
  
  return (
    <div className="mb-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        {/* Job Type Filter */}
        <div>
          <select
            name="type"
            value={filters.type}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Types</option>
            {jobTypes.map(type => (
              <option key={type} value={type.toLowerCase()}>
                {type}
              </option>
            ))}
          </select>
        </div>
        
        {/* Location Filter */}
        <div>
          <input
            type="text"
            name="location"
            value={filters.location}
            onChange={handleChange}
            placeholder="Location"
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        {/* Status Filter */}
        <div>
          <select
            name="status"
            value={filters.status}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Statuses</option>
            {jobStatuses.map(status => (
              <option key={status} value={status}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </option>
            ))}
          </select>
        </div>
        
        {/* Keyword Search */}
        <div>
          <input
            type="text"
            name="keyword"
            value={filters.keyword}
            onChange={handleChange}
            placeholder="Search keyword"
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
      
      {/* Filter Buttons */}
      <div className="flex justify-end gap-3">
        <button
          onClick={handleFilterApply}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
        >
          Filter
        </button>
        <button
          onClick={resetFilters}
          className="px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition"
        >
          Clear All Filters
        </button>
      </div>
    </div>
  );
};

const StatusBadge = ({ status }) => {
  let bgColor = '';
  let textColor = '';
  switch (status) {
    case 'pending':
      bgColor = 'bg-yellow-100';
      textColor = 'text-yellow-800';
      break;
    case 'active':
      bgColor = 'bg-green-100';
      textColor = 'text-green-800';
      break;
    case 'filled':
      bgColor = 'bg-blue-100';
      textColor = 'text-blue-800';
      break;
    case 'expired':
      bgColor = 'bg-red-100';
      textColor = 'text-red-800';
      break;
    default:
      bgColor = 'bg-gray-100';
      textColor = 'text-gray-800';
      break;
  }
  return (
    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${bgColor} ${textColor}`}>
      {status.toUpperCase()}
    </span>
  );
};

export default AdminNetwork;