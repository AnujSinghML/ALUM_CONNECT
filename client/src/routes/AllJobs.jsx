// // client/src/routes/AllJobs.jsx
// import React from 'react';
// import Layout from '../components/common/Layout';
// import Jobs from '../components/network/Jobs';
// import { useNavigate } from "react-router-dom";

// const AllJobs = () => {
//   const navigate = useNavigate();
//   return (
//     <Layout>
//       <div className="max-w-7xl mx-auto px-4 py-8">
//          {/* Back Button */}
//         <div className="flex justify-start mb-4">
//           <button
//             type="button"
//             onClick={() => navigate('/network')}
//             className="px-5 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg shadow-lg hover:bg-blue-700 transition"
//           >
//             ← Back
//           </button>
//         </div>
//         <div className="mb-8">
//           <h1 className="text-3xl font-bold text-gray-800 mb-4">All Job Opportunities</h1>
//           <p className="text-gray-600">
//             Explore all available job opportunities.
//           </p>
//         </div>
//         <Jobs preview={false} />
//       </div>
//     </Layout>
//   );
// };

// export default AllJobs;
// client/src/routes/AllJobs.jsx
import React, { useState, useEffect } from 'react';
import Layout from '../components/common/Layout';
import JobCard from '../components/network/JobCard'; // Ensure you have a JobCard component
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AllJobs = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [employmentType, setEmploymentType] = useState('');
  const [location, setLocation] = useState('');
  const [tag, setTag] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchFilteredJobs = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (employmentType) queryParams.append('employmentType', employmentType);
      if (location) queryParams.append('location', location);
      if (tag) queryParams.append('tag', tag);
  
      // Build URL: if no filters, don't add "?"
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
  

  // Fetch jobs on initial load
  useEffect(() => {
    fetchFilteredJobs();
  }, []);

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    fetchFilteredJobs();
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
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
            Filter
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
