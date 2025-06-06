import React, { useState, useEffect } from 'react';
import { Bell, MessageSquare, LogOut, User, Menu } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';

// Import images and utilities
import IIITNLogo from "../../../assets/IIITN_logo.svg";
import { handleLogout } from '../../utils/authUtils';

// Import context and components
import { useUser } from '../../context/UserContext';
import { useMessage } from '../../context/MessageContext';
import MessagePopup from '../messaging/MessagePopup';
import socketService from '../../services/socketService';

const Navbar = () => {
  // State management
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isMessagePopupOpen, setIsMessagePopupOpen] = useState(false);
  
  // Hooks
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading, setUser } = useUser();
  const { unreadCount } = useMessage();

  // Screen size detection
  useEffect(() => {
    const checkScreenSize = () => {
      setIsSmallScreen(window.innerWidth < 768);
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Clear menu when changing pages
  useEffect(() => {
    setShowProfileMenu(false);
  }, [location.pathname]);

  // Logout handler
  const logoutUser = () => {
    try {
      // Disconnect socket on logout
      socketService.disconnect();
      
      // Logout and navigate
      handleLogout(navigate, setUser);
      
      // Optional: Show success toast
      toast.success('Logged out successfully');
    } catch (error) {
      // Handle logout errors
      toast.error('Logout failed. Please try again.');
      console.error('Logout error:', error);
    }
  };

  // Navigate to profile function
  const goToProfile = () => {
    navigate('/profile');
    setShowProfileMenu(false);
  };

  // Toggle message popup
  const toggleMessagePopup = () => {
    setIsMessagePopupOpen(!isMessagePopupOpen);
  };

  // Profile menu toggle handler
  const toggleProfileMenu = () => {
    setShowProfileMenu(!showProfileMenu);
  };

  // Avatar URL generator
  const getAvatarUrl = (size = 40) => {
    if (!user || !user.name) {
      return `https://ui-avatars.com/api/?name=User&background=0D8ABC&color=fff&size=${size}`;
    }
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=0D8ABC&color=fff&size=${size}`;
  };

  // Outside click handler for profile menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showProfileMenu && !event.target.closest('.profile-menu')) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showProfileMenu]);

  return (
    <>
      <nav className="bg-white backdrop-blur-md bg-opacity-95 border-b border-gray-100 px-6 py-4 flex justify-between items-center fixed top-0 w-full z-50 shadow-sm">
        {/* Left side - Logo and College Name */}
        <div className="flex items-center space-x-3">
          <div className="bg-white p-1.5 rounded-lg shadow-sm">
            <img src={IIITNLogo} alt="IIIT-Nagpur Logo" className="w-9 h-9" />
          </div>
          <div className="flex flex-col">
            <span className="text-blue-600 font-semibold text-lg leading-tight">
              {isSmallScreen ? "IIIT-N" : "IIIT Nagpur"}
            </span>
            {!isSmallScreen && (
              <span className="text-gray-500 text-xs">Indian Institute of Information Technology, Nagpur</span>
            )}
          </div>
        </div>

        {/* Right side - Notifications, DMs, Profile */}
        <div className="flex items-center">
          {/* Notifications */}
          <button className="p-2 mx-1.5 hover:bg-gray-50 rounded-xl relative transition-all duration-200 cursor-pointer">
            <Bell className="w-8 h-8 text-gray-600" />
            <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center text-[10px] font-medium">
              3
            </span>
          </button>
          
          {/* Messages */}
          <button 
            onClick={toggleMessagePopup} 
            className="p-2 mx-1.5 hover:bg-gray-50 rounded-xl relative transition-all duration-200 cursor-pointer"
          >
            <MessageSquare className="w-8 h-8 text-gray-600" />
            {unreadCount > 0 && (
              <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center text-[10px] font-medium">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Profile Dropdown */}
          <div className="relative profile-menu ml-2">
            <button 
              onClick={toggleProfileMenu}
              className="flex items-center space-x-2 p-1.5 hover:bg-gray-50 rounded-xl transition-all duration-200 cursor-pointer"
            >
              {loading ? (
                <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse"></div>
              ) : (
                // Display profile image if available, otherwise use avatar
                <div className="w-10 h-10 rounded-full ring-1 ring-blue-100 overflow-hidden">
                  <img
                    src={user?.profileImage || getAvatarUrl(40)}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              {!isSmallScreen && (
                <div className="flex items-center">
                  <span className="text-sm font-medium text-gray-700 mr-1">{user?.name?.split(' ')[0] || 'User'}</span>
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </div>
              )}
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-3 w-72 bg-white rounded-xl shadow-lg py-2 z-50 transform transition-all duration-200 ease-out border border-gray-100">
                {/* Profile Header */}
                <div className="px-4 py-3 border-b border-gray-100">
                  {loading ? (
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 rounded-full bg-gray-200 animate-pulse"></div>
                      <div>
                        <div className="h-5 w-32 bg-gray-200 rounded animate-pulse mb-1"></div>
                        <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-3">
                      {/* Display profile image if available, otherwise use avatar */}
                      <div className="w-12 h-12 rounded-full ring-2 ring-blue-100 overflow-hidden">
                        <img
                          src={user?.profileImage || getAvatarUrl(48)}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-base font-semibold text-gray-800 truncate">
                          {user?.name || 'User'}
                        </h3>
                        <div className="flex items-center">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {user?.role || 'Student'}
                          </span>
                          <p className="text-gray-500 text-xs ml-1 truncate">{user?.email || 'No email available'}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Profile Menu Options */}
                <div className="px-2 py-2">
                  <button
                    onClick={goToProfile}
                    className="flex items-center space-x-3 w-full px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-200"
                  >
                    <User className="w-6 h-6" />
                    <span className="font-medium text-sm">My Profile</span>
                  </button>
                  
                  <button
                    onClick={logoutUser}
                    className="flex items-center space-x-3 w-full px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200 mt-1"
                  >
                    <LogOut className="w-6 h-6" />
                    <span className="font-medium text-sm">Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Message Popup */}
      <MessagePopup 
        open={isMessagePopupOpen} 
        onClose={() => setIsMessagePopupOpen(false)} 
      />
    </>
  );
};

export default Navbar;