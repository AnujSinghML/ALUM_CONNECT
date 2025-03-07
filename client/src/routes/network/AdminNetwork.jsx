import React, { useState, useEffect } from 'react';
import Layout from '../../components/common/Layout';
import axios from 'axios';
import { CheckCircle2, XCircle } from 'lucide-react';

const AdminNetwork = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch all jobs from the admin endpoint
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_backend_URL}/api/jobs/admin`, 
          { withCredentials: true }
        );
        setJobs(res.data);
      } catch (err) {
        console.error('Error fetching admin jobs:', err);
        setError('Failed to load admin network data');
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  // Filter to show only jobs with status === 'pending'
  const pendingJobs = jobs.filter((job) => job.status === 'pending');

  // Accept => set status to 'active'
  const handleAccept = async (jobId) => {
    try {
      const res = await axios.patch(
        `${import.meta.env.VITE_backend_URL}/api/jobs/admin/${jobId}/status`,
        { status: 'active' },
        { withCredentials: true }
      );
      // Update local state
      setJobs((prevJobs) =>
        prevJobs.map((job) => (job._id === jobId ? res.data.data : job))
      );
    } catch (err) {
      console.error('Error accepting job:', err);
      setError('Failed to accept job.');
    }
  };

  // Reject => delete from DB
  const handleReject = async (jobId) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_backend_URL}/api/jobs/admin/${jobId}`,
        { withCredentials: true }
      );
      // Remove from local state
      setJobs((prevJobs) => prevJobs.filter((job) => job._id !== jobId));
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
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Pending Job Opportunities</h1>
          <span className="text-gray-500">
            {pendingJobs.length} {pendingJobs.length === 1 ? 'job' : 'jobs'} found
          </span>
        </div>

        {pendingJobs.length === 0 ? (
          <p className="text-gray-600">No pending job opportunities.</p>
        ) : (
          // Grid layout for job cards
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
            {pendingJobs.map((job) => (
              <div 
                key={job._id} 
                className="relative bg-white border rounded-lg shadow-sm p-5 flex flex-col justify-between"
              >
                {/* Top section - job info */}
                <div>
                  {/* Possibly an icon or logo placeholder */}
                  <div className="mb-4 h-12 w-12 bg-gray-100 rounded flex items-center justify-center">
                    <span className="text-gray-400 text-sm">Logo</span>
                  </div>

                  <h2 className="font-semibold text-lg text-gray-900 mb-1">
                    {job.title}
                  </h2>
                  <p className="text-sm text-gray-600">
                    {job.company} • {job.location}
                  </p>

                  {/* Additional job info (employmentType, salary, etc.) */}
                  <div className="mt-2 text-sm text-gray-500 space-y-1">
                    <p>Type: <span className="font-medium">{job.employmentType}</span></p>
                    {job.salary && <p>Salary: <span className="font-medium">{job.salary}</span></p>}
                  </div>

                  {/* Job description snippet */}
                  <p className="mt-2 text-sm text-gray-500 line-clamp-3">
                    {job.description}
                  </p>
                </div>

                {/* Bottom section - accept/reject buttons */}
                <div className="mt-4 flex items-center gap-2">
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
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default AdminNetwork;
