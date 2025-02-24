import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminAnnouncements = ({ user }) => {
  const [formData, setFormData] = useState({ type: 'event', title: '', description: '', image: null });

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
      await axios.post('http://localhost:3000/api/announcements/add', data, {
        headers: { Authorization: token }
      });

      alert('Announcement added');
      setFormData({ type: 'event', title: '', description: '', image: null });
    } catch (err) {
      console.error('Error adding announcement:', err);
      alert('Failed to add announcement');
    }
  };

  return (
    <div className="p-6 bg-white shadow rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Add Announcement</h2>

      {/* Show event option only for admin */}
      {user.role === 'admin' && (
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
      )}

      {/* Allow both students & alumni to add achievements */}
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
        <input type="file" className="border p-2 w-full mb-2" onChange={handleFileChange} required />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2">
          Add Announcement
        </button>
      </form>
    </div>
  );
};

export default AdminAnnouncements;
