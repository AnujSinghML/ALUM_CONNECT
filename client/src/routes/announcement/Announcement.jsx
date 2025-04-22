import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Layout from '../../components/common/Layout';
import { ArrowRight, Calendar, MapPin, PlusCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useSidebarLayout } from '../../hooks/useSidebarLayout';

const Announcement = () => {
  const navigate = useNavigate();

  const [announcements, setAnnouncements] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAlumni, setIsAlumni] = useState(false);

  useSidebarLayout(true);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_backend_URL}/api/announcements`);
        console.log("API Response:", response.data);

        if (!response.data || !Array.isArray(response.data)) {
          throw new Error('Invalid response from server');
        }

        // Separate events & achievements
        const eventAnnouncements = response.data.filter(item => item.type === 'event');
        const achievementItems = response.data.filter(item => item.type === 'achievement');

        console.log("Events:", eventAnnouncements);
        console.log("Achievements:", achievementItems);

        // Show only first 6 for demonstration
        setAnnouncements(eventAnnouncements.slice(0, 6));
        setAchievements(achievementItems.slice(0, 6));
      } catch (err) {
        console.error('Error fetching announcements:', err.message);
        setError('Failed to load announcements');
      } finally {
        setLoading(false);
      }
    };

    const fetchUserRole = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_backend_URL}/auth/profile`,
          { withCredentials: true }
        );

        // If user is admin, immediately redirect to admin announcements
        if (response.data.role === 'admin') {
          navigate('/admin/announcements');
          return;  // Stop here so we don't load normal announcements
        }

        // Otherwise, if user is alumni, set state for Add Achievement button
        setIsAlumni(response.data.role === 'alumni');
      } catch (error) {
        console.error("Error fetching user role:", error);
        // If no user or not logged in, do nothing special
      }
    };

    fetchAnnouncements();
    fetchUserRole();
  }, [navigate]);

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-pulse font-medium text-blue-600">Loading content...</div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="bg-red-50 text-red-500 p-4 rounded-xl text-center font-medium">
          {error}
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-6 md:py-10 animate-fade-in">
        {/* Announcements Section */}
        <div className="mb-10 md:mb-16">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-3 md:gap-0">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Latest Events</h2>
            <Link
              to="/announcements/all-events"
              className="flex items-center gap-2 text-blue-600 font-medium hover:text-blue-700 transition-colors text-sm md:text-base"
            >
              View all events <ArrowRight size={18} />
            </Link>
          </div>

          {announcements.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm p-6 text-center text-gray-500">
              No events available at the moment.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {announcements.map((announcement) => (
                <div
                  key={announcement._id}
                  className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 group flex flex-col h-full"
                >
                  {/* If there's an imageUrl, show the image */}
                  {announcement.imageUrl && (
                    <div className="h-48 md:h-52 overflow-hidden">
                      <img
                        src={announcement.imageUrl}
                        alt={announcement.title}
                        className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-500"
                      />
                    </div>
                  )}
                  <div className="p-5 md:p-6 flex flex-col flex-grow">
                    <div className="mb-3">
                      <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-medium inline-block">
                        Event
                      </span>
                    </div>
                    <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-3">
                      {announcement.title}
                    </h3>
                    <p className="text-gray-600 text-sm md:text-base font-normal leading-relaxed mb-4 flex-grow">
                      {announcement.description.length > 120 
                        ? `${announcement.description.substring(0, 120)}...` 
                        : announcement.description}
                    </p>

                    {/* Dynamic DateTime */}
                    <div className="flex items-center text-gray-500 text-sm">
                      <Calendar size={16} className="mr-2 flex-shrink-0" />
                      <span className="truncate">
                        {announcement.eventDateTime
                          ? new Date(announcement.eventDateTime).toLocaleString()
                          : "No date/time provided"}
                      </span>
                    </div>

                    {/* Dynamic Venue or fallback */}
                    <div className="flex items-center text-gray-500 text-sm mt-2">
                      <MapPin size={16} className="mr-2 flex-shrink-0" />
                      <span className="truncate">
                        {announcement.venue || "No venue provided"}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Achievements Section */}
        <div>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-3 md:gap-0">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Recent Achievements</h2>
            <div className="flex flex-wrap gap-3 md:gap-4">
              {/* Show "Add Achievement" button only to alumni */}
              {isAlumni && (
                <Link
                  to="/create-achievement"
                  className="flex items-center gap-2 bg-green-600 text-white px-3 md:px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium shadow-md"
                >
                  <PlusCircle size={18} className="flex-shrink-0" /> Add Achievement
                </Link>
              )}
              <Link
                to="/announcements/all-achievements"
                className="flex items-center gap-2 text-purple-600 font-medium hover:text-purple-700 transition-colors text-sm md:text-base"
              >
                View all achievements <ArrowRight size={18} className="flex-shrink-0" />
              </Link>
            </div>
          </div>

          {achievements.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm p-6 text-center text-gray-500">
              No achievements to display.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {achievements.map((achievement) => (
                <div
                  key={achievement._id}
                  className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-all duration-300 border border-gray-50"
                >
                  <div className="flex flex-col md:flex-row items-center md:items-start gap-4 md:gap-5">
                    {achievement.imageUrl ? (
                      <img
                        src={achievement.imageUrl}
                        alt={achievement.name}
                        className="w-20 h-20 rounded-full object-cover border-2 border-purple-100 flex-shrink-0"
                      />
                    ) : (
                      <div className="w-20 h-20 rounded-full bg-purple-100 flex items-center justify-center text-purple-500 font-bold text-2xl flex-shrink-0">
                        {achievement.name?.charAt(0) || "A"}
                      </div>
                    )}
                    <div className="text-center md:text-left">
                      <div className="mb-2">
                        <span className="px-3 py-1 bg-purple-50 text-purple-600 rounded-full text-xs font-medium inline-block">
                          Achievement
                        </span>
                      </div>
                      <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-2">
                        {achievement.name}
                      </h3>
                      <p className="text-sm md:text-base text-gray-600 font-normal leading-relaxed">
                        {achievement.description.length > 150 
                          ? `${achievement.description.substring(0, 150)}...` 
                          : achievement.description}
                      </p>
                    </div>
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

export default Announcement;