import React, { useEffect, useState } from 'react';
import Layout from '../components/common/Layout';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import ProfileHeader from '../components/profile/ProfileHeader';
import SocialLinks from '../components/profile/SocialLinks';
import ProfileSections from '../components/profile/ProfileSections';
import ActivitySection from '../components/profile/ActivitySection';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchProfile = async () => {
    try {
      const response = await axios.get('http://localhost:3000/auth/profile', { 
        withCredentials: true 
      });
      console.log("Received profile data:", response.data);
      setProfile(response.data);
      setLoading(false);
    } catch (err) {
      console.error("Error loading profile:", err);
      setError('Failed to load profile');
      setLoading(false);
      if (err.response && err.response.status === 401) {
        navigate('/login');
      }
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [navigate]);

  const handleProfileUpdate = async (updatedData) => {
    try {
      const response = await axios.patch(
        'http://localhost:3000/api/profile/update',
        updatedData,
        { withCredentials: true }
      );

      if (response.data.success) {
        // Update the profile state with the new data
        setProfile(prevProfile => ({
          ...prevProfile,
          ...response.data.data
        }));

        // Show success message if you have a toast/notification system
        console.log('Profile updated successfully');
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      // Handle error (show error message)
      setError(err.response?.data?.message || 'Failed to update profile');
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        </div>
      </Layout>
    );
  }
  
  if (error) {
    return (
      <Layout>
        <div className="p-6 text-center">
          <div className="text-red-500 mb-4">{error}</div>
          <button 
            onClick={() => navigate('/login')}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Return to Login
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {/* Header background */}
          <div className="h-32 bg-gradient-to-r from-blue-500 to-blue-700"></div>
          <div className="px-6 py-4 md:px-8 md:py-6 -mt-16">
            <ProfileHeader 
              profile={profile} 
              onProfileUpdate={handleProfileUpdate}
            />
            {profile.socialLinks && <SocialLinks socialLinks={profile.socialLinks} />}
            <ProfileSections profile={profile} />
            <ActivitySection lastLogin={profile.lastLogin} />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;