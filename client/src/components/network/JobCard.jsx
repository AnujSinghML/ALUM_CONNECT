// client/src/components/network/JobCard.jsx
import React from 'react';

const JobCard = ({ title, company, description, location, salary, tags, authorName }) => (
  <div className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow">
    <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>
    <p className="text-gray-600 text-sm mb-3 line-clamp-2">{description}</p>
    <div className="flex justify-between items-center mb-3">
      <span className="text-blue-600 font-medium">{company}</span>
      <span className="text-gray-500 text-sm">{location}</span>
    </div>
    {/* New line to display author information */}
    <div className="mb-3">
      <span className="text-gray-700 text-sm">Posted by: {authorName}</span>
    </div>
    {salary && (
      <div className="mb-3">
        <span className="text-green-600 font-medium">{salary}</span>
      </div>
    )}
    <div className="flex flex-wrap gap-2">
      {tags && tags.map((tag, index) => (
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

export default JobCard;
