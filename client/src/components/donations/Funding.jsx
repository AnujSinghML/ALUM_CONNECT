// src/components/donations/Funding.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const FundingCard = ({ title, description, amount, author, tags }) => (
  <div className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow">
    <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>
    <p className="text-gray-600 text-sm mb-3 line-clamp-2">{description}</p>
    <div className="flex justify-between items-center mb-3">
      <span className="text-blue-600 font-medium">₹{amount}</span>
      <span className="text-gray-500 text-sm">{author}</span>
    </div>
    <div className="flex flex-wrap gap-2">
      {tags.map((tag, index) => (
        <span 
          key={index}
          className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
        >
          {tag}
        </span>
      ))}
    </div>
  </div>
);

// Hardcoded data - will come from DB later
const fundingRequests = [
  {
    title: "AI-Based Healthcare Solution",
    description: "Developing an AI system for early disease detection and diagnosis using machine learning algorithms and medical imaging data.",
    amount: "15,00,000",
    author: "Batch 2022",
    tags: ["Healthcare", "AI", "Technology"]
  },
  {
    title: "Smart Campus Initiative",
    description: "IoT-based smart infrastructure for college campus including smart lighting, energy management, and security systems.",
    amount: "25,00,000",
    author: "Batch 2021",
    tags: ["IoT", "Infrastructure"]
  },
  {
    title: "Renewable Energy Project",
    description: "Solar and wind energy implementation project for sustainable campus development.",
    amount: "20,00,000",
    author: "Batch 2023",
    tags: ["Energy", "Sustainability"]
  },
  // Add more items here for the full view
];

const Funding = ({ preview = false }) => {
  const navigate = useNavigate();
  
  // Show only 2 items in preview mode
  const displayedRequests = preview ? fundingRequests.slice(0, 2) : fundingRequests;

  return (
    <div className="h-full bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Boost Start-Up Culture</h2>
        {preview && (
          <button
            onClick={() => navigate('/donation/opportunities')}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            View All →
          </button>
        )}
      </div>

      <div className="space-y-6">
        {/* Main Features */}
        <div className="grid grid-cols-1 gap-4">
          <div className="bg-purple-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-purple-800 mb-2">
              Invest in College Startups and Projects
            </h3>
            <p className="text-gray-700">
              Support innovative ideas from your alma mater's entrepreneurs.
            </p>
          </div>
        </div>

        {/* Funding Requests */}
        <div className="space-y-4">
          <div className="grid gap-4">
            {displayedRequests.map((request, index) => (
              <FundingCard key={index} {...request} />
            ))}
          </div>
          
          <div className="flex justify-between items-center mt-6">
            <button
              onClick={() => navigate('/donation/create-funding-request')}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
            >
              Create your own Request!
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Funding;
