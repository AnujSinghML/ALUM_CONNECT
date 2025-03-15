import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { Megaphone, Network, MessageCircle, Heart, User } from 'lucide-react';
import { useUser } from '../../context/UserContext';



const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useUser();
  const role = user?.role?.toLowerCase() || 'student';
  const [collapsed, setCollapsed] = useState(false);
  
  // Handle responsive behavior - collapse on small screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setCollapsed(true);
      }
    };
    
    // Set initial state
    handleResize();
    
    // Add event listener
    window.addEventListener('resize', handleResize);
    
    // Clean up
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Custom navigation handler to prevent sidebar expansion
  const handleNavigation = useCallback((e, path) => {
    e.preventDefault();
    navigate(path);
    // Don't change collapsed state here
  }, [navigate]);

  // Define menu items based on role
  const menuItems = [
    { 
      path: role === 'admin' ? '/admin/announcements' : '/announcements', 
      icon: Megaphone, 
      label: 'Announcements' 
    },
    { 
      path: role === 'admin' ? '/admin/network' : '/network', 
      icon: Network, 
      label: 'Network Hub' 
    },
    { 
      path: role === 'admin' ? '/admin/discussion' : '/discussion', 
      icon: MessageCircle, 
      label: 'Discussion' 
    },
    { 
      path: role === 'admin' ? '/admin/donation' : '/donation', 
      icon: Heart, 
      label: 'Donations' 
    },
    { 
      path: role === 'admin' ? '/admin/profile' : '/profile', 
      icon: User, 
      label: 'Profile' 
    },
  ];

  return (
    <div
      className={`fixed left-0 top-16 h-screen transition-all duration-300 bg-white shadow-md z-10 ${
        collapsed ? "w-16" : "w-64"
      }`}
    >
      <div className="p-4 pb-6">
        {/* Logo or app name could go here */}
      </div>

      {/* Menu Items */}
      <div className="px-3 space-y-1">
        {menuItems.map((item) => {
          const isActive = location.pathname.startsWith(item.path);
          const Icon = item.icon;
          
          return (
            <a
              key={item.path}
              href={item.path}
              onClick={(e) => handleNavigation(e, item.path)}
              className={`flex items-center group py-2.5 px-3 rounded-lg transition-all duration-200 ${
                isActive
                  ? "bg-blue-500 text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <div className="flex items-center justify-center">
                <Icon size={18} className={isActive ? "" : "text-gray-500 group-hover:text-gray-800"} />
              </div>
              
              {!collapsed && (
                <span className="ml-3 font-medium text-sm">
                  {item.label}
                </span>
              )}
              
              {!collapsed && isActive && (
                <div className="ml-auto text-xs font-medium text-blue-100">
                  {/* You could add notification count here */}
                </div>
              )}
            </a>
          );
        })}
      </div>
      
      {/* Collapse/Expand button at the bottom */}
      <div className="absolute bottom-20 w-full flex justify-center">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex items-center justify-center p-1.5 rounded-lg text-gray-500 hover:text-gray-800 transition-all duration-200"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {/* Option 1: If you can use the SVG file directly */}
          {/* <img 
            src={CollapseIcon} 
            alt="Toggle sidebar" 
            className={`w-5 h-5 ${collapsed ? "rotate-180" : ""}`} 
          /> */}
          
          {/* Option 2: Use an embedded SVG in case image import doesn't work */}
          <svg 
            width="20" 
            height="20" 
            viewBox="0 0 24 24" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            className={collapsed ? "rotate-180" : ""}
          >
            <rect
              x="4"
              y="4"
              width="16"
              height="16"
              rx="3"
              stroke="currentColor"
              strokeWidth="1.5"
              fill="none"
            />
            <path
              d="M10 8L14 12L10 16"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
      
      {/* User profile at bottom */}
      <div className="absolute bottom-4 left-0 right-0 px-3">
        <div className="flex items-center p-2 rounded-lg hover:bg-gray-100 transition-all duration-200">
          <div className="w-8 h-8 rounded-full bg-gray-300 flex-shrink-0">
            {/* User avatar could go here */}
          </div>
          {!collapsed && (
            <div className="ml-3 truncate">
              <p className="text-sm font-medium text-gray-700 truncate">{user?.name || 'User'}</p>
              <p className="text-xs text-gray-500 truncate">{user?.email || 'user@example.com'}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;