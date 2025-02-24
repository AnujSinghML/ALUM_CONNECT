import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Layout from '../components/common/Layout';

const Announcement = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/announcements');

        if (!response.data || !Array.isArray(response.data)) {
          throw new Error('Invalid response from server');
        }

        setAnnouncements(response.data);
      } catch (err) {
        console.error('Error fetching announcements:', err.message);
        setError('Failed to load announcements');
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncements();
  }, []);

  if (loading) return <p>Loading announcements...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <Layout>
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Announcements</h1>

        {announcements.length === 0 ? (
          <p>No announcements available.</p>
        ) : (
          <div className="space-y-6">
            {announcements.map((announcement) => (
              <div key={announcement._id} className="p-4 border rounded-lg shadow-md">
                {announcement.type === 'event' && (
                  <div>
                    {announcement.imageUrl && (
                      <img
                        src={announcement.imageUrl}
                        alt={announcement.title}
                        className="w-full h-48 object-cover rounded-lg mb-4"
                      />
                    )}
                    <h2 className="text-xl font-semibold text-gray-900">{announcement.title}</h2>
                    <p className="text-gray-700">{announcement.description}</p>
                  </div>
                )}

                {announcement.type === 'achievement' && (
                  <div className="flex items-center space-x-4">
                    {announcement.imageUrl && (
                      <img
                        src={announcement.imageUrl}
                        alt={announcement.name}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                    )}
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900">{announcement.name}</h2>
                      <p className="text-gray-700">{announcement.description}</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Announcement;
