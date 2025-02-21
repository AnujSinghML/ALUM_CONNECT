import React, { useState } from 'react';
import axios from 'axios';

const AdminAnnouncements = () => {
  const [formData, setFormData] = useState({ type: 'event', title: '', description: '', image: null });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    const data = new FormData();
    data.append('type', formData.type);
    data.append('title', formData.title);
    data.append('description', formData.description);
    data.append('image', formData.image);

    await axios.post('http://localhost:5000/api/announcements/add', data, {
      headers: { Authorization: token }
    });

    alert('Announcement added');
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 bg-white shadow rounded-lg">
      <input type="text" placeholder="Title" className="border p-2 w-full" onChange={e => setFormData({...formData, title: e.target.value})} />
      <input type="file" className="border p-2 w-full mt-2" onChange={e => setFormData({...formData, image: e.target.files[0]})} />
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 mt-2">Add</button>
    </form>
  );
};

export default AdminAnnouncements;
