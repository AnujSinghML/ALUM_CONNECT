// client/src/components/network/JobCard.jsx
import React, { useState } from 'react';

const JobCard = ({
  title,
  company,
  description,
  location,
  salary,
  tags,
  authorName,
  authorEmail,
  requirements,
  responsibilities,
  applicationUrl,
  status,
  jobId,
  currentUserEmail,
  onStatusChange
}) => {
  const [expanded, setExpanded] = useState(false);

  // Debug logs to confirm correct values
  console.log('Current User Email:', currentUserEmail);
  console.log('Author Email:', authorEmail);

  // If you want a case-insensitive comparison:
  const isAuthor = currentUserEmail?.toLowerCase() === authorEmail?.toLowerCase();
  console.log('Is Author:', isAuthor);

  // Format text with line breaks
  const formatText = (text) => {
    return text.split('\n').map((line, i) => (
      <React.Fragment key={i}>
        {line}
        <br />
      </React.Fragment>
    ));
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow">
      <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>

      {/* Basic information - always visible */}
      <div className="flex justify-between items-center mb-3">
        <span className="text-blue-600 font-medium">{company}</span>
        <span className="text-gray-500 text-sm">{location}</span>
      </div>

      <div className="mb-3">
        <span className="text-gray-700 text-sm">Posted by: {authorName}</span>
      </div>

      {salary && (
        <div className="mb-3">
          <span className="text-green-600 font-medium">{salary}</span>
        </div>
      )}

      {/* Collapsed view of description */}
      {!expanded && (
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{description}</p>
      )}

      {/* Expanded view with full content */}
      {expanded && (
        <div className="mt-4 mb-4">
          <h4 className="font-medium text-gray-800 mb-2">Description:</h4>
          <p className="text-gray-600 mb-4">{description}</p>

          <h4 className="font-medium text-gray-800 mb-2">Requirements:</h4>
          <p className="text-gray-600 mb-4">{formatText(requirements || '')}</p>

          <h4 className="font-medium text-gray-800 mb-2">Responsibilities:</h4>
          <p className="text-gray-600 mb-4">{formatText(responsibilities || '')}</p>
        </div>
      )}

      <div className="flex flex-wrap gap-2 mb-4">
        {tags && tags.map((tag, index) => (
          <span
            key={index}
            className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="flex flex-wrap justify-between items-center mt-4">
        {/* Toggle expand/collapse button */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          {expanded ? 'Show Less' : 'Read More'}
        </button>

        {/* Show "Apply Now" button only if the user is NOT the author */}
        {applicationUrl && !isAuthor && (
          <a
            href={applicationUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            Apply Now
          </a>
        )}

        {/* Show "Mark as Filled" button only if user is author and job is active */}
        {isAuthor && status === 'active' && (
          <button
            onClick={() => onStatusChange(jobId, 'filled')}
            className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition ml-2"
          >
            Mark as Filled
          </button>
        )}
      </div>
    </div>
  );
};

export default JobCard;
