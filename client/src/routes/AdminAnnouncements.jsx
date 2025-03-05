import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Layout from '../components/common/Layout';
import { PlusCircle, Trash2, CheckCircle2, XCircle } from 'lucide-react';

const AdminAnnouncements = () => {
  const navigate = useNavigate();

  // States for announcements & loading/error
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Form fields for creating a new event
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [venue, setVenue] = useState('');
  const [eventDateTime, setEventDateTime] = useState('');
  const [image, setImage] = useState(null);

  // Check if user is actually admin
  const [isAdmin, setIsAdmin] = useState(false);

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
          alert('Access denied. Admins only.');
          return navigate('/announcements'); 
        }
        setIsAdmin(true);

        // 2️⃣ Fetch all announcements (admin sees everything)
        const annRes = await axios.get(
          `${import.meta.env.VITE_backend_URL}/api/admin/announcements/all`,
          { withCredentials: true }
        );
        setAnnouncements(annRes.data);
      } catch (err) {
        console.error('Error fetching admin data:', err);
        setError('Failed to load announcements.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  // ----------------------------------
  // Create Event (POST /api/admin/announcements/event)
  // ----------------------------------
  const handleCreateEvent = async (e) => {
    e.preventDefault();
    setError('');

    try {
      // We’ll use FormData to handle file upload
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('venue', venue);
      formData.append('eventDateTime', eventDateTime); // date-time string
      if (image) formData.append('image', image);

      const res = await axios.post(
        `${import.meta.env.VITE_backend_URL}/api/admin/announcements/event`,
        formData,
        { withCredentials: true }
      );

      // Add newly created event to the top of the announcements list
      setAnnouncements(prev => [res.data.data, ...prev]);

      // Clear the form
      setTitle('');
      setDescription('');
      setVenue('');
      setEventDateTime('');
      setImage(null);

      alert('Event created successfully!');
    } catch (err) {
      console.error('Error creating event:', err);
      setError('Failed to create event.');
    }
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
    } catch (err) {
      console.error('Error approving announcement:', err);
      setError('Failed to approve announcement.');
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
      // Option A: set status='rejected' in DB
      setAnnouncements(prev =>
        prev.map(a => a._id === id ? res.data.data : a)
      );
      // Option B (if route deletes from DB), remove from state:
      // setAnnouncements(prev => prev.filter(a => a._id !== id));
    } catch (err) {
      console.error('Error rejecting announcement:', err);
      setError('Failed to reject announcement.');
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
      setAnnouncements(prev => prev.filter(a => a._id !== id));
    } catch (err) {
      console.error('Error deleting announcement:', err);
      setError('Failed to delete announcement.');
    }
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

  return (
    <Layout>
      <div className="max-w-5xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Admin Announcements Panel</h1>
        
        {error && (
          <div className="bg-red-50 text-red-500 p-4 rounded mb-4">
            {error}
          </div>
        )}

        {/* 1️⃣ Create Event Form */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Create New Event</h2>
          <form onSubmit={handleCreateEvent} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded p-2"
                value={title}
                onChange={e => setTitle(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                className="w-full border border-gray-300 rounded p-2"
                rows="3"
                value={description}
                onChange={e => setDescription(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Venue
              </label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded p-2"
                value={venue}
                onChange={e => setVenue(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Event Date & Time
              </label>
              <input
                type="datetime-local"
                className="w-full border border-gray-300 rounded p-2"
                value={eventDateTime}
                onChange={e => setEventDateTime(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Upload Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={e => setImage(e.target.files[0])}
                className="w-full border border-gray-300 rounded p-2"
              />
            </div>

            <button
              type="submit"
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            >
              <PlusCircle size={18} />
              Create Event
            </button>
          </form>
        </div>

        {/* 2️⃣ Display All Announcements */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">All Announcements</h2>
          {announcements.length === 0 ? (
            <p className="text-gray-600">No announcements found.</p>
          ) : (
            <div className="space-y-4">
              {announcements.map((item) => (
                <div
                  key={item._id}
                  className="p-4 border border-gray-200 rounded-md flex flex-col md:flex-row md:items-center md:justify-between"
                >
                  <div>
                    <p className="text-sm text-gray-500 mb-1">
                      {item.type === 'event' ? 'Event' : 'Achievement'} | Status: <strong>{item.status}</strong>
                    </p>
                    <h3 className="text-lg font-semibold text-gray-800">{item.title}</h3>
                    <p className="text-gray-600 text-sm mt-1">{item.description}</p>

                    {/* Show Venue & DateTime if event */}
                    {item.type === 'event' && (
                      <div className="mt-2 text-sm text-gray-500">
                        <span className="font-semibold">Venue: </span>{item.venue}
                        <br />
                        <span className="font-semibold">Date & Time: </span>
                        {new Date(item.eventDateTime).toLocaleString()}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 mt-3 md:mt-0">
                    {/* Approve/Reject only if pending & type=achievement */}
                    {item.type === 'achievement' && item.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleApprove(item._id)}
                          className="flex items-center gap-1 text-white bg-green-600 px-3 py-1 rounded hover:bg-green-700"
                        >
                          <CheckCircle2 size={16} />
                          Approve
                        </button>
                        <button
                          onClick={() => handleReject(item._id)}
                          className="flex items-center gap-1 text-white bg-red-600 px-3 py-1 rounded hover:bg-red-700"
                        >
                          <XCircle size={16} />
                          Reject
                        </button>
                      </>
                    )}

                    {/* Delete button for all */}
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="flex items-center gap-1 text-white bg-gray-500 px-3 py-1 rounded hover:bg-gray-600"
                    >
                      <Trash2 size={16} />
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default AdminAnnouncements;
