// src/components/donations/Funding.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const FundingCard = ({ title, description, amount, authorName, tags, details }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow">
      <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>
      
      {/* Conditionally apply line clamp if not expanded */}
      <p className={`text-gray-600 text-sm mb-3 ${expanded ? '' : 'line-clamp-2'}`}>
        {description}
      </p>
      
      {/* Optionally display extra details when expanded */}
      {expanded && details && (
        <p className="text-gray-600 text-sm mb-3">{details}</p>
      )}

      <button 
        onClick={() => setExpanded(!expanded)}
        className="text-blue-600 text-sm mb-3 focus:outline-none"
      >
        {expanded ? 'Show Less' : 'Show More'}
      </button>

      <div className="flex justify-between items-center mb-3">
        <span className="text-blue-600 font-medium">₹{amount}</span>
        <span className="text-gray-500 text-sm">{authorName}</span>
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
};

const Funding = ({ preview = false, filter }) => {
  const navigate = useNavigate();

  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOpportunities = async () => {
      try {
        let url = `${import.meta.env.VITE_backend_URL}/api/opportunities`;
        // Append filter query params if provided and not in preview mode
        if (filter && !preview) {
          const queryParams = new URLSearchParams();
          if (filter.category) queryParams.append('category', filter.category);
          if (filter.search) queryParams.append('search', filter.search);
          url += '?' + queryParams.toString();
        }
        const response = await axios.get(url);
        setOpportunities(response.data);
        setLoading(false);
      } catch (err) {
        setError('Error loading opportunities');
        setLoading(false);
      }
    };

    fetchOpportunities();
  }, [filter, preview]); // re-run if filter changes

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-red-600">{error}</div>;
  }

  // In preview mode, show only 2 items.
  const displayedRequests = preview ? opportunities.slice(0, 2) : opportunities;
 
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
              // Pass details along for extra information on expand
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
