// client/src/routes/network/AdminNetwork.jsx
import React, { useState, useEffect } from 'react';
import Layout from '../../components/common/Layout';
import axios from 'axios';

const AdminNetwork = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        // Example admin endpoint
        const res = await axios.get(`${import.meta.env.VITE_backend_URL}/api/jobs/admin`, {
          withCredentials: true
        });
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

  if (loading) {
    return (
      <Layout>
        <div className="text-center p-8">Loading Admin Network data...</div>
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
        <h1 className="text-2xl font-bold mb-6">Admin Network Dashboard</h1>
        {jobs.length === 0 ? (
          <p className="text-gray-600">No jobs found.</p>
        ) : (
          jobs.map((job) => (
            <div key={job._id} className="border rounded p-4 mb-4">
              <h2 className="font-semibold text-lg">{job.title}</h2>
              <p className="text-sm text-gray-600">
                {job.company} - {job.location}
              </p>
              <p className="text-gray-500 mt-2">{job.description}</p>
              {/* More job info & admin actions... */}
            </div>
          ))
        )}
      </div>
    </Layout>
  );
};

export default AdminNetwork;
