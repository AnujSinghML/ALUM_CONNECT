// client/src/components/Navbar.jsx
import React, { useState, useEffect } from 'react';
import { Bell, MessageSquare, LogOut, User } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import IIITNLogo from "../../../assets/IIITN_logo.svg";
import { handleLogout } from '../../utils/authUtils';
import { useUser } from '../../context/UserContext';

const Navbar = () => {
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading, setUser } = useUser();

  // Check screen size
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

  const logoutUser = () => {
    handleLogout(navigate, setUser);
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

  const getAvatarUrl = (size = 40) => {
    if (!user || !user.name) {
      return `https://ui-avatars.com/api/?name=User&background=0D8ABC&color=fff&size=${size}`;
    }
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=0D8ABC&color=fff&size=${size}`;
  };

  return (
    <nav className="bg-white shadow-md px-6 py-3 flex justify-between items-center fixed top-0 w-full z-50">
      {/* Left side - Logo and College Name */}
      <div className="flex items-center space-x-4">
        <img src={IIITNLogo} alt="IIIT-Nagpur Logo" className="w-10 h-10" />
        <span className="text-blue-600 font-semibold text-xl">
          {isSmallScreen ? "IIIT-N" : "Indian Institute of Information Technology - Nagpur"}
        </span>
      </div>

      {/* Right side - Notifications, DMs, Profile */}
      <div className="flex items-center space-x-6">
        <button className="p-2.5 hover:bg-gray-100 rounded-full relative transition-all duration-200">
          <Bell className="w-7 h-7 text-gray-600" />
          <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            3
          </span>
        </button>
        <button className="p-2.5 hover:bg-gray-100 rounded-full transition-all duration-200">
          <MessageSquare className="w-7 h-7 text-gray-600" />
        </button>

        {/* Profile Dropdown */}
        <div className="relative profile-menu">
          <button 
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="p-1 hover:bg-gray-100 rounded-full transition-all duration-200"
          >
            {loading ? (
              <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse"></div>
            ) : (
              <img
                src={getAvatarUrl(40)}
                alt="Profile"
                className="w-10 h-10 rounded-full ring-2 ring-blue-100"
              />
            )}
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-xl py-2 z-50 transform transition-all duration-200 ease-out border border-gray-100">
              <div className="px-4 py-3 border-b border-gray-100">
                {loading ? (
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 rounded-full bg-gray-200 animate-pulse"></div>
                    <div>
                      <div className="h-6 w-32 bg-gray-200 rounded animate-pulse mb-2"></div>
                      <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center space-x-4">
                    <img
                      src={getAvatarUrl(60)}
                      alt="Profile"
                      className="w-16 h-16 rounded-full ring-4 ring-blue-100"
                    />
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800">
                        {user?.name || 'User'}
                      </h3>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {user?.role || 'Student'}
                      </span>
                      <p className="text-gray-500">{user?.email || 'No email available'}</p>
                    </div>
                  </div>
                )}
              </div>

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
                  onClick={logoutUser}
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
