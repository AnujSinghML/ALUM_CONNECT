import React, { useState, useEffect } from 'react';
import { Bell, MessageSquare, ChevronDown, LogOut, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import IIITNLogo from "../../img/IIITN_logo.svg";

const Navbar = ({ userProfile }) => {
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkScreenSize = () => {
      setIsSmallScreen(window.innerWidth < 768);
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_backend_URL}/auth/logout`, {}, {
        withCredentials: true
      });
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

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
    <nav className="bg-white shadow-md px-6 py-3 flex justify-between items-center fixed top-0 w-full z-50">
      {/* Left side - Logo and College Name */}
      <div className="flex items-center space-x-4">
        <img src={IIITNLogo} alt="IIIT-Nagpur Logo" className="w-10 h-10" />
        <span className="text-blue-600 font-semibold text-xl">
          {isSmallScreen 
            ? "IIIT-N" 
            : "Indian Institute of Information Technology - Nagpur"}
        </span>
      </div>

      {/* Right side - Notifications, DMs, Profile */}
      <div className="flex items-center space-x-6">
        {/* Notification Bell */}
        <button className="p-2.5 hover:bg-gray-100 rounded-full relative transition-all duration-200">
          <Bell className="w-7 h-7 text-gray-600" />
          <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            3
          </span>
        </button>

        {/* Messages */}
        <button className="p-2.5 hover:bg-gray-100 rounded-full transition-all duration-200">
          <MessageSquare className="w-7 h-7 text-gray-600" />
        </button>

        {/* Profile Dropdown */}
        <div className="relative profile-menu">
          <button 
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="p-1 hover:bg-gray-100 rounded-full transition-all duration-200"
          >
            <img
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(userProfile?.name || 'User')}&background=0D8ABC&color=fff&size=40`}
              alt="Profile"
              className="w-10 h-10 rounded-full ring-2 ring-blue-100"
            />
          </button>

          {/* Enhanced Dropdown Menu */}
          {showProfileMenu && (
            <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-xl py-2 z-50 transform transition-all duration-200 ease-out border border-gray-100">
              {/* Profile Header */}
              <div className="px-4 py-3 border-b border-gray-100">
                <div className="flex items-center space-x-4">
                  <img
                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(userProfile?.name || 'User')}&background=0D8ABC&color=fff&size=60`}
                    alt="Profile"
                    className="w-16 h-16 rounded-full ring-4 ring-blue-100"
                  />
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">
                      {userProfile?.name}
                    </h3>
                    {/* Add this in the profile section of dropdown */}
<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
  {userProfile?.role || 'Student'}
</span>
                    <p className="text-gray-500">{userProfile?.email}</p>
                  </div>
                </div>
              </div>

              {/* Menu Options */}
              <div className="px-2 py-2">
                <button
                  onClick={() => {
                    navigate('/profile');
                    setShowProfileMenu(false);
                  }}
                  className="flex items-center space-x-3 w-full px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-xl transition-colors duration-200"
                >
                  <User className="w-5 h-5" />
                  <span className="font-medium">My Profile</span>
                </button>
                
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-3 w-full px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors duration-200 mt-1"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="font-medium">Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;