// client/src/components/network/Jobs.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import JobCard from "./JobCard";

const Jobs = ({ preview = false }) => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isAlumni, setIsAlumni] = useState(false); // ✅ State to track alumni status

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_backend_URL}/api/jobs`
        );
        setJobs(response.data);
        setLoading(false);
      } catch (err) {
        setError("Error loading job opportunities");
        setLoading(false);
      }
    };

    const fetchUserRole = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_backend_URL}/auth/profile`,
          { withCredentials: true }
        );
        setIsAlumni(response.data.role === "alumni"); // ✅ Check if the user is an alumni
      } catch (error) {
        console.error("Error fetching user role:", error);
      }
    };

    fetchJobs();
    fetchUserRole(); // ✅ Fetch user role on component mount
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-red-600">{error}</div>;
  }

  const displayedJobs = preview ? jobs.slice(0, 2) : jobs;

  return (
    <div className="h-full bg-white rounded-lg shadow-md p-6 mt-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Job Opportunities</h2>
        {preview && (
          <button
            onClick={() => navigate("/network/all-jobs")}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            View All Jobs →
          </button>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {displayedJobs.map((job, index) => (
          <JobCard key={index} {...job} />
        ))}
      </div>

      {/* ✅ Show "Create Job Opportunity" button only to alumni */}
      <div className="flex justify-end mt-6">
        {isAlumni && (
          <button
            onClick={() => navigate("/network/create-job")}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
          >
            Create Job Opportunity
          </button>
        )}
      </div>
    </div>
  );
};

export default Jobs;
