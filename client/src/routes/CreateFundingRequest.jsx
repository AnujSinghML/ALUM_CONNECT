//client\src\routes\CreateFundingRequest.jsx
import React, { useState , useEffect} from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';

const CreateFundingRequest = () => {
  const [requestData, setRequestData] = useState({
    title: '',
    description: '',
    amount: '',
    category: '',
    details: '',
    authorEmail: '',
    tags: [],
    status: 'pending'  // Add this default value
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/auth/profile`, { withCredentials: true });

        if (response.data.email) {
          setRequestData(prevData => ({
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
  
    console.log('Starting form submission');
    console.log('Form data:', requestData);
  
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/opportunities/createOpportunity`, 
        requestData,
        { 
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      console.log('Submission successful:', response.data);
      setSuccess('Funding request submitted successfully!');
      navigate('/donation/opportunities');
    } catch (err) {
      console.error('Submission error:', err.response?.data || err);
      setError(err.response?.data?.message || 'Error submitting request');
    }
  };
  

  return (
    
    <div className="max-w-3xl mx-auto p-6">
       {/* New Back Button */}
       <button
          type="button"
          onClick={() => navigate('/donation')}
          className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 mt-4 hover:bg-gray-100"
        >
          Back
        </button>
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Create Funding Request</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Project Title
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              value={requestData.title}
              onChange={(e) => setRequestData({...requestData, title: e.target.value})}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Short Description
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              value={requestData.description}
              onChange={(e) => setRequestData({...requestData, description: e.target.value})}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Funding Amount Required
            </label>
            <input
              type="number"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              value={requestData.amount}
              onChange={(e) => setRequestData({...requestData, amount: e.target.value})}
              required
            />
          </div>
  {/* Added email field */}
  <div>
  <label className="block text-sm font-medium text-gray-700 mb-1">
    Your Email
  </label>
  <input
    type="email"
    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
    value={requestData.authorEmail || ''}
    readOnly
  />
</div>



      
      {error && (
        <div className="text-red-600 mb-4">{error}</div>
      )}
      {success && (
        <div className="text-green-600 mb-4">{success}</div>
      )}

      
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              value={requestData.category}
              onChange={(e) => setRequestData({...requestData, category: e.target.value})}
              required
            >
              <option value="">Select Category</option>
              <option value="startup">Startup</option>
              <option value="research">Research Project</option>
              <option value="innovation">Innovation</option>
              <option value="patent">Patent</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Detailed Description
            </label>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              rows="6"
              value={requestData.details}
              onChange={(e) => setRequestData({...requestData, details: e.target.value})}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700"
          >
            Submit Request
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateFundingRequest;