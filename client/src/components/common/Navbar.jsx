import React, { useState, useEffect } from 'react';
import { Search, Bell, MessageSquare, Menu } from 'lucide-react';
import IIITNLogo from "../../img/IIITN_logo.svg";

const Navbar = () => {
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  // Check if the screen is small when component mounts and on window resize
  useEffect(() => {
    const checkScreenSize = () => {
      setIsSmallScreen(window.innerWidth < 768); // 768px is typical md breakpoint
    };
    
    // Initial check
    checkScreenSize();
    
    // Listen for window resize
    window.addEventListener('resize', checkScreenSize);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Toggle search box visibility on mobile
  const toggleSearch = () => {
    setShowSearch(!showSearch);
  };

  return (
    <nav className="bg-white shadow-md px-4 py-2 flex justify-between items-center fixed top-0 w-full z-50">
      {/* Left side - Logo and College Name */}
      <div className="flex items-center space-x-3">
        {/* Logo */}
        <img src={IIITNLogo} alt="IIIT-Nagpur Logo" className="w-8 h-8" />
        
        {/* College name - changes based on screen size */}
        <span className="text-blue-600 font-semibold text-lg">
          {isSmallScreen 
            ? "IIIT-N" 
            : "Indian Institute of Information Technology - Nagpur"}
        </span>
      </div>

      {/* Right side - Search, Notifications, DMs */}
      <div className="flex items-center space-x-4">
        {/* Search - shows as input on large screens, button on small screens */}
        {isSmallScreen ? (
          <>
            <button 
              onClick={toggleSearch} 
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <Search className="w-6 h-6 text-gray-600" />
            </button>
            
            {/* Expandable search input for mobile */}
            {showSearch && (
              <div className="absolute top-16 left-0 right-0 bg-white p-4 shadow-md z-50">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                  <Search className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            />
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
          </div>
        )}

        {/* Notification Bell */}
        <button className="p-2 hover:bg-gray-100 rounded-full relative">
          <Bell className="w-6 h-6 text-gray-600" />
          <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
            3
          </span>
        </button>

        {/* Messages */}
        <button className="p-2 hover:bg-gray-100 rounded-full">
          <MessageSquare className="w-6 h-6 text-gray-600" />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;