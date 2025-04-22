// client/src/routes/AdminCreateJob.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import Layout from '../../components/common/Layout';
import { useSidebarLayout } from '../../hooks/useSidebarLayout';

const AdminCreateJob = () => {
  const [jobData, setJobData] = useState({
    title: '',
    company: '',
    description: '',
    location: '',
    salary: '',
    employmentType: '',
    requirements: '',
    responsibilities: '',
    applicationDeadline: '',
    status: 'active' // Admin created jobs are automatically active
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  
  useSidebarLayout(true);

  useEffect(() => {
    // Fetch admin data to populate authorEmail automatically
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_backend_URL}/auth/profile`, { withCredentials: true });
        if (response.data.email) {
          setJobData(prevData => ({
            ...prevData,
            authorEmail: response.data.email
          }));
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
  
    fetchUserData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_backend_URL}/api/jobs/createJob`, 
        jobData,
        { 
          withCredentials: true,
          headers: { 'Content-Type': 'application/json' }
        }
      );
      setSuccess('Job opportunity created successfully!');
      
      // Allow user to see success message before redirecting
      setTimeout(() => {
        navigate('/admin/network');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Error creating job opportunity');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setJobData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <Layout>
      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Back Button */}
        <button
          type="button"
          onClick={() => navigate('/admin/network')}
          className="mb-6 flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Network Admin
        </button>

        <div className="bg-white rounded-xl shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Create Job Opportunity</h2>
          
          {success && (
            <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-lg border border-green-100">
              {success}
            </div>
          )}
          
          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg border border-red-100">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  Job Title
                </label>
                <input
                  id="title"
                  name="title"
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={jobData.title}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div>
                <label htmlFor="authorEmail" className="block text-sm font-medium text-gray-700 mb-1">
                  Your Email
                </label>
                <input
                  id="authorEmail"
                  type="email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
                  value={jobData.authorEmail || ''}
                  readOnly
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
                  Company
                </label>
                <input
                  id="company"
                  name="company"
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={jobData.company}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <input
                  id="location"
                  name="location"
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={jobData.location}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="salary" className="block text-sm font-medium text-gray-700 mb-1">
                  Salary
                </label>
                <input
                  id="salary"
                  name="salary"
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={jobData.salary}
                  onChange={handleInputChange}
                  placeholder="e.g. ₹5,00,000 - ₹7,00,000 per annum"
                />
              </div>
              
              <div>
                <label htmlFor="employmentType" className="block text-sm font-medium text-gray-700 mb-1">
                  Employment Type
                </label>
                <select
                  id="employmentType"
                  name="employmentType"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={jobData.employmentType}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Type</option>
                  <option value="full-time">Full-time</option>
                  <option value="part-time">Part-time</option>
                  <option value="contract">Contract</option>
                  <option value="internship">Internship</option>
                  <option value="remote">Remote</option>
                  <option value="freelance">Freelance</option>
                </select>
              </div>
            </div>
            
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Job Description
              </label>
              <textarea
                id="description"
                name="description"
                rows="4"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={jobData.description}
                onChange={handleInputChange}
                required
              ></textarea>
            </div>
            
            <div>
              <label htmlFor="requirements" className="block text-sm font-medium text-gray-700 mb-1">
                Requirements
              </label>
              <textarea
                id="requirements"
                name="requirements"
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={jobData.requirements}
                onChange={handleInputChange}
                required
                placeholder="List the skills, qualifications and experience required"
              ></textarea>
            </div>
            
            <div>
              <label htmlFor="responsibilities" className="block text-sm font-medium text-gray-700 mb-1">
                Responsibilities
              </label>
              <textarea
                id="responsibilities"
                name="responsibilities"
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={jobData.responsibilities}
                onChange={handleInputChange}
                required
                placeholder="List the key responsibilities and duties of this role"
              ></textarea>
            </div>
            
            <div>
              <label htmlFor="applicationDeadline" className="block text-sm font-medium text-gray-700 mb-1">
                Application Deadline
              </label>
              <input
                id="applicationDeadline"
                name="applicationDeadline"
                type="date"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={jobData.applicationDeadline}
                onChange={handleInputChange}
              />
            </div>
                        
            <div className="flex justify-end pt-4">
              <button
                type="submit"
                className="px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition shadow-sm"
              >
                Create Job Opportunity
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default AdminCreateJob;