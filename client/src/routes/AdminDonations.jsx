// client/src/routes/AdminDonations.jsx
import React, { useState, useEffect } from 'react';
import Layout from '../components/common/Layout';
import axios from 'axios';
import { CheckCircle2, XCircle, Trash2, Filter, ChevronDown, ChevronUp } from 'lucide-react';
import { useSidebarLayout } from '../hooks/useSidebarLayout'; 

const AdminDonations = () => {
  const [donations, setDonations] = useState([]);
  const [filteredDonations, setFilteredDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  
  // Filter states
  const [filters, setFilters] = useState({
    status: '',
    purpose: '',
    batch: '',
    minAmount: '',
    maxAmount: '',
    keyword: '',
  });

  useSidebarLayout(true);
  
  // Fetch donation requests from admin endpoint
  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_backend_URL}/api/donations/admin`,
          { withCredentials: true }
        );
        setDonations(res.data);
        setFilteredDonations(res.data);
      } catch (err) {
        console.error('Error fetching donations:', err);
        setError('Failed to load donation requests');
      } finally {
        setLoading(false);
      }
    };
    fetchDonations();
  }, []);

  // Apply filters when filter state changes
  useEffect(() => {
    applyFilters();
  }, [filters, donations]);

  // Filter donations based on current filter settings
  const applyFilters = () => {
    let result = [...donations];

    // Filter by status
    if (filters.status) {
      result = result.filter(donation => donation.status === filters.status);
    }

    // Filter by purpose
    if (filters.purpose) {
      result = result.filter(donation => 
        donation.purpose.toLowerCase().includes(filters.purpose.toLowerCase())
      );
    }

    // Filter by batch
    if (filters.batch) {
      result = result.filter(donation => 
        donation.batch && donation.batch.toLowerCase().includes(filters.batch.toLowerCase())
      );
    }

    // Filter by min amount
    if (filters.minAmount) {
      result = result.filter(donation => 
        donation.amount >= Number(filters.minAmount)
      );
    }

    // Filter by max amount
    if (filters.maxAmount) {
      result = result.filter(donation => 
        donation.amount <= Number(filters.maxAmount)
      );
    }

    // Filter by keyword (searches in name, email, and comments)
    if (filters.keyword) {
      const keyword = filters.keyword.toLowerCase();
      result = result.filter(donation => 
        (donation.name && donation.name.toLowerCase().includes(keyword)) ||
        (donation.email && donation.email.toLowerCase().includes(keyword)) ||
        (donation.comments && donation.comments.toLowerCase().includes(keyword))
      );
    }

    setFilteredDonations(result);
  };

  // Handle filter input changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Reset all filters
  const resetFilters = () => {
    setFilters({
      status: '',
      purpose: '',
      batch: '',
      minAmount: '',
      maxAmount: '',
      keyword: '',
    });
  };

  // Admin action: Accept donation (set status to accepted)
  const handleAccept = async (id) => {
    try {
      const res = await axios.patch(
        `${import.meta.env.VITE_backend_URL}/api/donations/admin/${id}/accept`,
        {},
        { withCredentials: true }
      );
      const updatedDonation = res.data.data;
      
      setDonations(prev =>
        prev.map(donation => (donation._id === id ? updatedDonation : donation))
      );
    } catch (err) {
      console.error('Error accepting donation:', err);
      setError('Failed to accept donation');
    }
  };

  // Admin action: Reject donation (delete from DB)
  const handleReject = async (id) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_backend_URL}/api/donations/admin/${id}`,
        { withCredentials: true }
      );
      setDonations(prev => prev.filter(donation => donation._id !== id));
    } catch (err) {
      console.error('Error rejecting donation:', err);
      setError('Failed to reject donation');
    }
  };

  // Get unique purposes for filter dropdown
  const uniquePurposes = [...new Set(donations.map(d => d.purpose))];
  
  // Get unique batches for filter dropdown
  const uniqueBatches = [...new Set(donations.filter(d => d.batch).map(d => d.batch))];

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <p className="text-blue-600 font-medium">Loading donation requests...</p>
        </div>
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
      <div className="max-w-7xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">Donation Requests</h1>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
            >
              <Filter size={18} />
              {showFilters ? 'Hide Filters' : 'Show Filters'}
              {showFilters ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>
            
            <span className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg font-medium">
              {filteredDonations.length} {filteredDonations.length === 1 ? 'donation' : 'donations'} found
            </span>
          </div>
        </div>
        
        {/* Filters */}
        {showFilters && (
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-100">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
              {/* Status Filter */}
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  value={filters.status}
                  onChange={handleFilterChange}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="accepted">Accepted</option>
                </select>
              </div>
              
              {/* Purpose Filter */}
              <div>
                <label htmlFor="purpose" className="block text-sm font-medium text-gray-700 mb-1">
                  Purpose
                </label>
                <select
                  id="purpose"
                  name="purpose"
                  value={filters.purpose}
                  onChange={handleFilterChange}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Purposes</option>
                  {uniquePurposes.map(purpose => (
                    <option key={purpose} value={purpose}>
                      {purpose}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* Batch Filter */}
              <div>
                <label htmlFor="batch" className="block text-sm font-medium text-gray-700 mb-1">
                  Batch
                </label>
                <select
                  id="batch"
                  name="batch"
                  value={filters.batch}
                  onChange={handleFilterChange}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Batches</option>
                  {uniqueBatches.map(batch => (
                    <option key={batch} value={batch}>
                      {batch}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* Min Amount Filter */}
              <div>
                <label htmlFor="minAmount" className="block text-sm font-medium text-gray-700 mb-1">
                  Min Amount (₹)
                </label>
                <input
                  type="number"
                  id="minAmount"
                  name="minAmount"
                  value={filters.minAmount}
                  onChange={handleFilterChange}
                  placeholder="Min"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              {/* Max Amount Filter */}
              <div>
                <label htmlFor="maxAmount" className="block text-sm font-medium text-gray-700 mb-1">
                  Max Amount (₹)
                </label>
                <input
                  type="number"
                  id="maxAmount"
                  name="maxAmount"
                  value={filters.maxAmount}
                  onChange={handleFilterChange}
                  placeholder="Max"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              {/* Keyword Search */}
              <div>
                <label htmlFor="keyword" className="block text-sm font-medium text-gray-700 mb-1">
                  Search
                </label>
                <input
                  type="text"
                  id="keyword"
                  name="keyword"
                  value={filters.keyword}
                  onChange={handleFilterChange}
                  placeholder="Search name, email, comments..."
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            
            {/* Filter Actions */}
            <div className="flex justify-end">
              <button
                onClick={resetFilters}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
              >
                Reset Filters
              </button>
            </div>
          </div>
        )}
        
        {/* Donation Cards */}
        {filteredDonations.length === 0 ? (
          <div className="bg-white rounded-xl shadow p-8 text-center">
            <p className="text-gray-600 mb-4">No donation requests found matching your filters.</p>
            {Object.values(filters).some(val => val !== '') && (
              <button
                onClick={resetFilters}
                className="text-blue-500 font-medium hover:text-blue-700"
              >
                Reset Filters
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDonations.map((donation) => (
              <div
                key={donation._id}
                className="bg-white rounded-xl shadow hover:shadow-lg transition-shadow p-6 flex flex-col"
              >
                {/* Title / Project Name */}
                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                  {donation.name || 'Untitled Project'}
                </h2>

                {/* Basic Info */}
                <div className="text-sm text-gray-500 space-y-1 mb-4">
                  <p>
                    <span className="font-medium">Batch:</span> {donation.batch || 'N/A'}
                  </p>
                  <p>
                    <span className="font-medium">Email:</span> {donation.email}
                  </p>
                  <p>
                    <span className="font-medium">Purpose:</span> {donation.purpose}
                  </p>
                  <p>
                    <span className="font-medium">Amount:</span> ₹{donation.amount.toLocaleString('en-IN')}
                  </p>
                  {donation.comments && (
                    <p>
                      <span className="font-medium">Comments:</span> {donation.comments}
                    </p>
                  )}
                </div>

                {/* Status Pill */}
                <div className="mb-4">
                  <StatusPill status={donation.status} />
                </div>

                {/* Admin Actions */}
                <div className="mt-auto flex gap-3">
                  {donation.status === 'pending' ? (
                    <>
                      <button
                        onClick={() => handleAccept(donation._id)}
                        className="flex items-center gap-1 bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 text-sm"
                      >
                        <CheckCircle2 size={16} />
                        Accept
                      </button>
                      <button
                        onClick={() => handleReject(donation._id)}
                        className="flex items-center gap-1 bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 text-sm"
                      >
                        <XCircle size={16} />
                        Reject
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => handleReject(donation._id)}
                      className="flex items-center gap-1 bg-gray-600 text-white px-3 py-1 rounded hover:bg-gray-700 text-sm"
                    >
                      <Trash2 size={16} />
                      Delete
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default AdminDonations;

/**
 * A small helper component to display the donation status
 * as a color-coded pill (pending = yellow, accepted = green, rejected = red).
 */
const StatusPill = ({ status }) => {
  let bgClass = '';
  let textClass = '';
  let displayStatus = status;

  switch (status) {
    case 'pending':
      bgClass = 'bg-yellow-100';
      textClass = 'text-yellow-800';
      break;
    case 'accepted':
      bgClass = 'bg-green-100';
      textClass = 'text-green-800';
      break;
    case 'rejected':
      bgClass = 'bg-red-100';
      textClass = 'text-red-800';
      break;
    default:
      bgClass = 'bg-gray-100';
      textClass = 'text-gray-800';
      displayStatus = 'unknown';
      break;
  }

  return (
    <span
      className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${bgClass} ${textClass}`}
    >
      {displayStatus}
    </span>
  );
};