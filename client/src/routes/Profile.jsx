import React, { useEffect, useState } from 'react';
import Layout from '../components/common/Layout';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaLinkedin, FaInstagram, FaGithub, FaTwitter, FaMapMarkerAlt, FaBriefcase, FaGraduationCap, FaHome, FaCalendarAlt, FaEdit } from 'react-icons/fa';

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:3000/auth/logout', {}, { withCredentials: true });
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
    >
      Logout
    </button>
  );
};

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
};

const SocialLinks = ({ socialMedia }) => {
  if (!socialMedia) return null;
  
  // Map social media links, handling both x and twitter
  const socialIcons = [
    { key: 'linkedin', icon: <FaLinkedin className="text-blue-600" />, url: socialMedia.linkedin },
    { key: 'github', icon: <FaGithub className="text-gray-800" />, url: socialMedia.github },
    { key: 'instagram', icon: <FaInstagram className="text-pink-600" />, url: socialMedia.instagram },
    { key: 'twitter', icon: <FaTwitter className="text-blue-400" />, url: socialMedia.twitter || socialMedia.x }
  ].filter(item => item.url && item.url.trim() !== '');

  if (socialIcons.length === 0) return null;

  return (
    <div className="flex space-x-4 mt-4">
      {socialIcons.map(({ key, icon, url }) => (
        <a 
          key={key}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-2xl hover:opacity-80 transition"
        >
          {icon}
        </a>
      ))}
    </div>
  );
};

const InfoItem = ({ icon, label, value }) => {
  if (!value || value === 'null' || value === 'undefined') return null;
  
  return (
    <div className="flex items-start space-x-3 mb-4">
      <div className="mt-1 text-blue-600">
        {icon}
      </div>
      <div>
        <div className="text-sm text-gray-500">{label}</div>
        <div className="text-gray-800">{value}</div>
      </div>
    </div>
  );
};

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get('http://localhost:3000/auth/profile', { withCredentials: true })
      .then((response) => {
        console.log("Received profile data:", response.data); // Debug log
        setProfile(response.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading profile:", err);
        setError('Failed to load profile');
        setLoading(false);
        if (err.response && err.response.status === 401) {
          navigate('/login');
        }
      });
  }, [navigate]);

  if (loading) return (
    <Layout>
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    </Layout>
  );
  
  if (error) return (
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

  // Display work info only if it exists
  const workInfo = profile.currentCompanyRole 
    ? `${profile.currentCompanyRole} at ${profile.currentCompany || ''}`
    : profile.currentCompany || null;

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {/* Header with background */}
          <div className="h-32 bg-gradient-to-r from-blue-500 to-blue-700"></div>
          
          {/* Profile content */}
          <div className="px-6 py-4 md:px-8 md:py-6 -mt-16">
            {/* Profile picture and actions */}
            <div className="flex justify-between items-start mb-6">
              <div className="flex flex-col md:flex-row items-center md:items-end">
                <div className="w-24 h-24 rounded-full border-4 border-white bg-gray-200 overflow-hidden shadow-md">
                  <img 
                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(profile.name)}&background=0D8ABC&color=fff`}
                    alt={profile.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="md:ml-4 mt-4 md:mt-0 text-center md:text-left">
                  <h1 className="text-2xl font-bold text-gray-800">{profile.name}</h1>
                  <p className="text-gray-600">{profile.email}</p>
                  {profile.role && (
                    <span className="inline-block mt-2 px-2 py-1 text-xs font-semibold bg-blue-100 text-blue-800 rounded-full">
                      {profile.role.charAt(0).toUpperCase() + profile.role.slice(1)}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex space-x-2">
                <button 
                  onClick={() => {}}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition flex items-center"
                >
                  <FaEdit className="mr-2" /> Edit
                </button>
                <LogoutButton />
              </div>
            </div>

            {/* Social links */}
            {profile.socialMedia && <SocialLinks socialMedia={profile.socialMedia} />}
            
            {/* Main content */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">Personal Information</h2>
                <InfoItem 
                  icon={<FaCalendarAlt />} 
                  label="Date of Birth" 
                  value={formatDate(profile.dob)} 
                />
                <InfoItem 
                  icon={<FaHome />} 
                  label="Hometown" 
                  value={profile.homeTown} 
                />
                <InfoItem 
                  icon={<FaMapMarkerAlt />} 
                  label="Current Location" 
                  value={profile.location} 
                />
              </div>
              
              <div>
                <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">Academic & Professional</h2>
                <InfoItem 
                  icon={<FaGraduationCap />} 
                  label="Branch" 
                  value={profile.branch} 
                />
                <InfoItem 
                  icon={<FaGraduationCap />} 
                  label="Batch" 
                  value={profile.batch} 
                />
                <InfoItem 
                  icon={<FaBriefcase />} 
                  label="Current Work" 
                  value={workInfo} 
                />
              </div>
            </div>

            {/* Activity section */}
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">Activity</h2>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-600 italic">
                  {profile.lastLogin ? 
                    `Last active on ${formatDate(profile.lastLogin)}` : 
                    "No recent activity to display"
                  }
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;