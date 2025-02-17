import React from 'react';
import { Search, Bell, MessageSquare } from 'lucide-react';
import IIITNLogo from "../../img/IIITN_logo.svg";

const Navbar = () => {
  return (
    <nav className="bg-white shadow-md px-4 py-2 flex justify-between items-center fixed top-0 w-full z-50">
      {/* Left side - Logo and College Name */}
      <div className="flex items-center space-x-3">
        {/* Placeholder for logo - can be replaced with actual logo later */}
        <img src={IIITNLogo} alt="IIIT-Nagpur Logo" className="w-8 h-8" />
        <span className="text-blue-600 font-semibold text-lg">IIIT-Nagpur</span>
      </div>

      {/* Right side - Search, Notifications, DMs */}
      <div className="flex items-center space-x-6">
        {/* Search Bar */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search..."
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
          />
          <Search className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
        </div>

        {/* Notification Bell */}
        <button className="p-2 hover:bg-gray-100 rounded-full relative">
          <Bell className="w-6 h-6 text-gray-600" />
          <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
            3
          </span>
        </button>
{/* commit here */}
        {/* Messages */}
        <button className="p-2 hover:bg-gray-100 rounded-full">
          <MessageSquare className="w-6 h-6 text-gray-600" />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;