import React, { useState } from 'react';
import Layout from '../components/common/Layout';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AdminAnnouncements = ({ user }) => {
  const navigate = useNavigate();

  // Agar user admin nahi hai, toh form render na ho
  if (!user || user.role !== 'admin') {
    return (
      <Layout>
        <div className="p-6 bg-white shadow rounded-lg">
          <p className="text-red-500 font-semibold">
            Aapko is page ka access nahi hai. Sirf admin hi announcements add kar sakta hai.
          </p>
        </div>
      </Layout>
    );
  }

  const [formData, setFormData] = useState({ type: 'event', title: '', description: '', image: null });
  const [error, setError] = useState('');
  
  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle file input
  const handleFileChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    const data = new FormData();
    data.append('type', formData.type);
    data.append('title', formData.title);
    data.append('description', formData.description);
    data.append('image', formData.image);

    try {
      await axios.post(`${import.meta.env.VITE_backend_URL}/api/announcements/add`, data, {
        headers: { Authorization: token },
        withCredentials: true
      });

      alert('Announcement added');
      setFormData({ type: 'event', title: '', description: '', image: null });
    } catch (err) {
      console.error('Error adding announcement:', err);
      alert('Failed to add announcement');
    }
  };

  return (
    <Layout>
      <div className="p-6 bg-white shadow rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Add Announcement</h2>

        {/* Sirf admin ke liye event option */}
        <label className="block mb-2">
          <input
            type="radio"
            name="type"
            value="event"
            checked={formData.type === 'event'}
            onChange={handleChange}
          />
          <span className="ml-2">Event</span>
        </label>

        {/* Admin panel me hum achievements bhi add kar sakte hain, agar zaroorat ho toh yeh option bhi dikha sakte hain */}
        <label className="block mb-2">
          <input
            type="radio"
            name="type"
            value="achievement"
            checked={formData.type === 'achievement'}
            onChange={handleChange}
          />
          <span className="ml-2">Achievement</span>
        </label>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="title"
            placeholder="Title"
            className="border p-2 w-full mb-2"
            value={formData.title}
            onChange={handleChange}
            required
          />
          <textarea
            name="description"
            placeholder="Description"
            className="border p-2 w-full mb-2"
            value={formData.description}
            onChange={handleChange}
            required
          />
          <input 
            type="file" 
            className="border p-2 w-full mb-2" 
            onChange={handleFileChange} 
            required 
          />
          <button type="submit" className="bg-blue-500 text-white px-4 py-2">
            Add Announcement
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default AdminAnnouncements;
