import React, { useState } from 'react';

const CreateFundingRequest = () => {
  const [requestData, setRequestData] = useState({
    title: '',
    description: '',
    amount: '',
    category: '',
    details: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Will be integrated with backend later
    console.log('Request submitted:', requestData);
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
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