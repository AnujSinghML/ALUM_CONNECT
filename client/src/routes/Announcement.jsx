// client/routes/Dashboard.jsx
import React from 'react';
import { Typography } from '@mui/material';
import Layout from '../components/common/Layout';

const Announcement = () => {
  return (
    <Layout>
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Announcements</h1>
        {/* Your announcement content here */}
      </div>
    </Layout>
  );
};

export default Announcement;
