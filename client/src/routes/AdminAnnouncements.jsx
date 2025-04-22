import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Layout from '../components/common/Layout';
import { PlusCircle, Trash2, CheckCircle2, XCircle, ArrowRight, ChevronLeft, ChevronRight, Filter } from 'lucide-react';
import { useToast } from '../components/Toast';
import { useSidebarLayout } from '../hooks/useSidebarLayout';

const AdminAnnouncements = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [announcements, setAnnouncements] = useState([]);
  const [filteredAnnouncements, setFilteredAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const ITEMS_PER_PAGE = 10;

  // Check if user is actually admin
  const [isAdmin, setIsAdmin] = useState(false);

  // Filter states
  const [filters, setFilters] = useState({
    type: 'all',
    status: 'all',
    dateRange: 'all',
    startDate: '',
    endDate: ''
  });

  // Show/hide filter panel
  const [showFilters, setShowFilters] = useState(false);

  useSidebarLayout(true);

  // ----------------------------------
  // Fetch user role & announcements
  // ----------------------------------

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1️⃣ Check user role
        const profileRes = await axios.get(
          `${import.meta.env.VITE_backend_URL}/auth/profile`,
          { withCredentials: true }
        );
        if (profileRes.data.role !== 'admin') {
          showToast('Access denied. Admins only.', 'error');
          return navigate('/announcements'); 
        }
        setIsAdmin(true);

        // 2️⃣ Fetch all announcements (admin sees everything)
        const annRes = await axios.get(
          `${import.meta.env.VITE_backend_URL}/api/admin/announcements/all`,
          { withCredentials: true }
        );
        setAnnouncements(annRes.data);
        setFilteredAnnouncements(annRes.data);
        setTotalPages(Math.ceil(annRes.data.length / ITEMS_PER_PAGE));
      } catch (err) {
        console.error('Error fetching admin data:', err);
        setError('Failed to load announcements.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate, showToast]);

  // ----------------------------------
  // Apply Filters
  // ----------------------------------
  useEffect(() => {
    let filtered = [...announcements];

    // Filter by type
    if (filters.type !== 'all') {
      filtered = filtered.filter(item => item.type === filters.type);
    }

    // Filter by status
    if (filters.status !== 'all') {
      filtered = filtered.filter(item => item.status === filters.status);
    }

    // Filter by date range
    if (filters.dateRange === 'custom' && filters.startDate && filters.endDate) {
      const start = new Date(filters.startDate);
      const end = new Date(filters.endDate);
      end.setHours(23, 59, 59); // Include the end date fully

      filtered = filtered.filter(item => {
        const postDate = new Date(item.createdAt);
        return postDate >= start && postDate <= end;
      });
    } else if (filters.dateRange === 'last7days') {
      const today = new Date();
      const sevenDaysAgo = new Date(today);
      sevenDaysAgo.setDate(today.getDate() - 7);
      
      filtered = filtered.filter(item => {
        const postDate = new Date(item.createdAt);
        return postDate >= sevenDaysAgo;
      });
    } else if (filters.dateRange === 'last30days') {
      const today = new Date();
      const thirtyDaysAgo = new Date(today);
      thirtyDaysAgo.setDate(today.getDate() - 30);
      
      filtered = filtered.filter(item => {
        const postDate = new Date(item.createdAt);
        return postDate >= thirtyDaysAgo;
      });
    }

    setFilteredAnnouncements(filtered);
    setTotalPages(Math.ceil(filtered.length / ITEMS_PER_PAGE));
    setCurrentPage(1); // Reset to first page on filter change
  }, [filters, announcements]);

  // ----------------------------------
  // Handle Filter Changes
  // ----------------------------------
  const handleFilterChange = (name, value) => {
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const resetFilters = () => {
    setFilters({
      type: 'all',
      status: 'all',
      dateRange: 'all',
      startDate: '',
      endDate: ''
    });
  };

  // ----------------------------------
  // Approve a Pending Announcement
  // ----------------------------------
  const handleApprove = async (id) => {
    try {
      const res = await axios.patch(
        `${import.meta.env.VITE_backend_URL}/api/admin/announcements/${id}/approve`,
        {},
        { withCredentials: true }
      );
      setAnnouncements(prev =>
        prev.map(a => a._id === id ? res.data.data : a)
      );
      showToast('Announcement approved successfully', 'success');
    } catch (err) {
      console.error('Error approving announcement:', err);
      setError('Failed to approve announcement.');
      showToast('Failed to approve announcement', 'error');
    }
  };

  // ----------------------------------
  // Reject a Pending Announcement
  // ----------------------------------
  const handleReject = async (id) => {
    try {
      const res = await axios.patch(
        `${import.meta.env.VITE_backend_URL}/api/admin/announcements/${id}/reject`,
        {},
        { withCredentials: true }
      );
      setAnnouncements(prev =>
        prev.map(a => a._id === id ? res.data.data : a)
      );
      showToast('Announcement rejected', 'info');
    } catch (err) {
      console.error('Error rejecting announcement:', err);
      setError('Failed to reject announcement.');
      showToast('Failed to reject announcement', 'error');
    }
  };

  // ----------------------------------
  // Delete Announcement
  // ----------------------------------
  const handleDelete = async (id) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_backend_URL}/api/admin/announcements/${id}`,
        { withCredentials: true }
      );
      setAnnouncements(prev => {
        const updated = prev.filter(a => a._id !== id);
        // Filter will automatically apply to filtered announcements via the useEffect
        return updated;
      });
      showToast('Announcement removed successfully', 'success');
    } catch (err) {
      console.error('Error deleting announcement:', err);
      setError('Failed to delete announcement.');
      showToast('Failed to delete announcement', 'error');
    }
  };

  // ----------------------------------
  // Pagination handlers
  // ----------------------------------
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Get current page announcements
  const getCurrentPageAnnouncements = () => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredAnnouncements.slice(startIndex, endIndex);
  };

  // ----------------------------------
  // Navigate to Create Event Page
  // ----------------------------------
  const navigateToCreateEvent = () => {
    navigate('/admin/create-event');
  };

  // ----------------------------------
  // Render
  // ----------------------------------
  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-pulse font-medium text-blue-600">Loading admin announcements...</div>
        </div>
      </Layout>
    );
  }

  if (!isAdmin) {
    return (
      <Layout>
        <div className="p-8 text-center text-red-500">
          Access Denied. Admin Only.
        </div>
      </Layout>
    );
  }

  const currentAnnouncements = getCurrentPageAnnouncements();

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-6 bg-gray-50 min-h-screen">
        {/* Dashboard Header */}

        {error && (
          <div className="bg-red-50 text-red-500 p-4 rounded-lg mb-6 shadow-sm border border-red-100">
            {error}
          </div>
        )}

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Total Announcements Card */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-gray-500 text-sm">Total Announcements</p>
                <h2 className="text-3xl font-bold text-gray-800 mt-1">{announcements.length}</h2>
              </div>
              <div className="bg-blue-100 rounded-full p-2">
                <CheckCircle2 size={20} className="text-blue-600" />
              </div>
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <span className="text-green-500 font-medium">+8%</span>&nbsp;from last month
            </div>
          </div>

          {/* Pending Approvals Card */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-gray-500 text-sm">Pending Approvals</p>
                <h2 className="text-3xl font-bold text-gray-800 mt-1">
                  {announcements.filter(a => a.status === 'pending').length}
                </h2>
              </div>
              <div className="bg-orange-100 rounded-full p-2">
                <CheckCircle2 size={20} className="text-orange-600" />
              </div>
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <span className="text-red-500 font-medium">-11%</span>&nbsp;from last week
            </div>
          </div>

          {/* Active Events Card */}
          <div className="bg-gradient-to-r from-teal-500 to-teal-600 rounded-xl shadow-sm p-6 text-white">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-teal-100 text-sm">Active Events</p>
                <h2 className="text-3xl font-bold mt-1">
                  {announcements.filter(a => a.type === 'event' && a.status === 'approved').length}
                </h2>
              </div>
              <div className="bg-white/20 rounded-full p-2">
                <PlusCircle size={20} className="text-white" />
              </div>
            </div>
            <div className="mt-6 flex justify-between items-center">
              <span className="text-sm">Create New Event</span>
              <button 
                onClick={navigateToCreateEvent}
                className="bg-white/20 rounded-full p-1 hover:bg-white/30 transition"
              >
                <ArrowRight size={16} className="text-white" />
              </button>
            </div>
          </div>
        </div>

        {/* Announcements List with Filters */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="mb-6 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            <h2 className="text-xl font-semibold text-gray-800">All Announcements</h2>
            
            <div className="flex flex-wrap gap-2">
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition text-sm font-medium"
              >
                <Filter size={16} />
                {showFilters ? 'Hide Filters' : 'Show Filters'}
              </button>
              
              <button 
                onClick={navigateToCreateEvent}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-sm font-medium"
              >
                <PlusCircle size={16} />
                Create Event
              </button>
            </div>
          </div>
          
          {/* Filter Panel */}
          {showFilters && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-100">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Type Filter */}
                <div>
                  <label htmlFor="type-filter" className="block text-sm font-medium text-gray-700 mb-1">
                    Announcement Type
                  </label>
                  <select
                    id="type-filter"
                    value={filters.type}
                    onChange={(e) => handleFilterChange('type', e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Types</option>
                    <option value="event">Events</option>
                    <option value="achievement">Achievements</option>
                  </select>
                </div>
                
                {/* Status Filter */}
                <div>
                  <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    id="status-filter"
                    value={filters.status}
                    onChange={(e) => handleFilterChange('status', e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Statuses</option>
                    <option value="approved">Approved</option>
                    <option value="pending">Pending</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
                
                {/* Date Range Filter */}
                <div>
                  <label htmlFor="date-filter" className="block text-sm font-medium text-gray-700 mb-1">
                    Date Range
                  </label>
                  <select
                    id="date-filter"
                    value={filters.dateRange}
                    onChange={(e) => handleFilterChange('dateRange', e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Time</option>
                    <option value="last7days">Last 7 Days</option>
                    <option value="last30days">Last 30 Days</option>
                    <option value="custom">Custom Range</option>
                  </select>
                </div>
                
                {/* Reset Filters Button */}
                <div className="flex items-end">
                  <button
                    onClick={resetFilters}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 text-sm font-medium transition"
                  >
                    Reset Filters
                  </button>
                </div>
              </div>
              
              {/* Custom Date Range */}
              {filters.dateRange === 'custom' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <label htmlFor="start-date" className="block text-sm font-medium text-gray-700 mb-1">
                      Start Date
                    </label>
                    <input
                      type="date"
                      id="start-date"
                      value={filters.startDate}
                      onChange={(e) => handleFilterChange('startDate', e.target.value)}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="end-date" className="block text-sm font-medium text-gray-700 mb-1">
                      End Date
                    </label>
                    <input
                      type="date"
                      id="end-date"
                      value={filters.endDate}
                      onChange={(e) => handleFilterChange('endDate', e.target.value)}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              )}
              
              {/* Filter Results Summary */}
              <div className="mt-4 text-sm text-gray-500">
                Showing {filteredAnnouncements.length} out of {announcements.length} announcements
                {filters.type !== 'all' && ` • Type: ${filters.type}`}
                {filters.status !== 'all' && ` • Status: ${filters.status}`}
                {filters.dateRange !== 'all' && ` • Date: ${filters.dateRange === 'custom' ? 'Custom range' : filters.dateRange}`}
              </div>
            </div>
          )}
          
          {filteredAnnouncements.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No announcements found matching your filters.</p>
              <button 
                onClick={resetFilters}
                className="mt-4 text-blue-600 font-medium"
              >
                Reset filters
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {currentAnnouncements.map((item) => (
                <div
                  key={item._id}
                  className="p-4 border border-gray-100 rounded-lg hover:shadow-md transition flex flex-col md:flex-row md:items-center md:justify-between gap-4"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                        item.type === 'event' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
                      }`}>
                        {item.type === 'event' ? 'Event' : 'Achievement'}
                      </span>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                        item.status === 'approved' ? 'bg-green-100 text-green-700' : 
                        item.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                      </span>
                      <span className="text-xs text-gray-500">
                        Posted: {new Date(item.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    
                    <h3 className="text-lg font-semibold text-gray-800">{item.title}</h3>
                    <p className="text-gray-600 text-sm mt-1 line-clamp-2">{item.description}</p>

                    {/* Show Venue & DateTime if event */}
                    {item.type === 'event' && (
                      <div className="mt-2 text-sm text-gray-500 flex flex-wrap gap-x-4">
                        <span><span className="font-medium">Venue:</span> {item.venue}</span>
                        <span><span className="font-medium">Date:</span> {new Date(item.eventDateTime).toLocaleDateString()}</span>
                        <span><span className="font-medium">Time:</span> {new Date(item.eventDateTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Approve/Reject only if pending & type=achievement */}
                    {item.type === 'achievement' && item.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleApprove(item._id)}
                          className="flex items-center gap-1 text-white bg-green-600 px-3 py-1.5 rounded-lg hover:bg-green-700 text-sm"
                        >
                          <CheckCircle2 size={16} />
                          Approve
                        </button>
                        <button
                          onClick={() => handleReject(item._id)}
                          className="flex items-center gap-1 text-white bg-red-600 px-3 py-1.5 rounded-lg hover:bg-red-700 text-sm"
                        >
                          <XCircle size={16} />
                          Reject
                        </button>
                      </>
                    )}

                    {/* Delete button for all */}
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="flex items-center gap-1 text-white bg-gray-500 px-3 py-1.5 rounded-lg hover:bg-gray-600 text-sm"
                    >
                      <Trash2 size={16} />
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {filteredAnnouncements.length > 0 && (
            <div className="mt-6 flex justify-between items-center">
              <p className="text-sm text-gray-500">
                Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1}-
                {Math.min(currentPage * ITEMS_PER_PAGE, filteredAnnouncements.length)} of {filteredAnnouncements.length} announcements
              </p>
              <div className="flex gap-2">
                <button 
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1}
                  className={`flex items-center gap-1 px-3 py-1 border border-gray-200 rounded-lg text-sm ${
                    currentPage === 1 
                      ? 'text-gray-400 cursor-not-allowed' 
                      : 'hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <ChevronLeft size={16} />
                  Previous
                </button>
                <button 
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  className={`flex items-center gap-1 px-3 py-1 rounded-lg text-sm ${
                    currentPage === totalPages 
                      ? 'bg-blue-400 text-white cursor-not-allowed' 
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  Next
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default AdminAnnouncements;