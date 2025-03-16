import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Megaphone, Network, MessageCircle, Heart, User, LogOut, ChevronLeft, ChevronRight } from 'lucide-react';
import { useUser } from '../../context/UserContext';

const SidebarItem = ({ icon: Icon, label, path, active, collapsed, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`flex items-center w-full py-2.5 px-3 rounded-lg text-sm font-medium transition-all duration-200 group relative ${
        active 
          ? "bg-blue-500 text-white" 
          : "text-gray-600 hover:bg-gray-100 hover:text-gray-800"
      }`}
    >
      <div className="flex items-center justify-center">
        <Icon size={collapsed ? 20 : 18} className={`transition-all ${!active && "text-gray-500 group-hover:text-gray-800"}`} />
      </div>
      
      {!collapsed && (
        <span className="ml-3 transition-opacity duration-200">
          {label}
        </span>
      )}
      
      {/* Active indicator dot */}
      {active && (
        <div className={`absolute ${collapsed ? "right-1.5" : "right-3"} top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-white`} />
      )}

      {/* Tooltip for collapsed state */}
      {collapsed && (
        <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap z-20">
          {label}
        </div>
      )}
    </button>
  );
};

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useUser();
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

  // Adjust main content when sidebar state changes
  useEffect(() => {
    document.body.style.setProperty('--sidebar-width', collapsed ? '70px' : '240px');
    
    // Add a class to the body for global layout adjustments
    if (collapsed) {
      document.body.classList.add('sidebar-collapsed');
      document.body.classList.remove('sidebar-expanded');
    } else {
      document.body.classList.add('sidebar-expanded');
      document.body.classList.remove('sidebar-collapsed');
    }
  }, [collapsed]);

  // Navigation handler - modified to preserve collapsed state
  const handleNavigation = useCallback((path) => {
    // Just navigate, don't change collapsed state
    navigate(path);
  }, [navigate]);

  // Logout handler
  const handleLogout = useCallback(() => {
    if (logout) {
      logout();
      navigate('/login');
    }
  }, [logout, navigate]);

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
    <aside 
      className={`fixed left-0 top-18 h-[calc(100vh-4rem)] bg-white border-r border-gray-200 shadow-sm z-30 transition-all duration-300 ease-in-out ${
        collapsed ? "w-[70px]" : "w-[240px]"
      }`}
    >
      <div className="flex flex-col h-full">
        {/* Navigation */}
        <nav className="flex-1 px-2 overflow-y-auto py-4 space-y-1">
          {menuItems.map((item) => {
            const isActive = location.pathname.startsWith(item.path);
            
            return (
              <SidebarItem
                key={item.path}
                icon={item.icon}
                label={item.label}
                path={item.path}
                active={isActive}
                collapsed={collapsed}
                onClick={() => handleNavigation(item.path)}
              />
            );
          })}
        </nav>

        {/* User profile section */}
        <div className={`mt-auto border-t border-gray-200 p-3 ${collapsed ? "flex flex-col items-center" : ""}`}>
          <div className={`flex items-center ${collapsed ? "justify-center flex-col" : ""} mb-2 p-2 rounded-lg hover:bg-gray-100 transition-all`}>
            <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium text-sm">
              {user?.name?.charAt(0) || 'U'}
            </div>
            {!collapsed && (
              <div className="ml-3 truncate">
                <p className="text-sm font-medium text-gray-700 truncate">{user?.name || 'User'}</p>
                <p className="text-xs text-gray-500 truncate">{user?.email || 'user@example.com'}</p>
              </div>
            )}
          </div>
          
          {/* Logout button */}
          <button 
            onClick={handleLogout}
            className={`flex items-center w-full py-2 px-3 text-sm text-red-500 hover:bg-red-50 rounded-lg transition-all ${
              collapsed ? "justify-center" : ""
            }`}
          >
            <LogOut size={18} />
            {!collapsed && <span className="ml-2">Logout</span>}
            
            {/* Tooltip for collapsed state */}
            {collapsed && (
              <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap z-20">
                Logout
              </div>
            )}
          </button>
          
          {/* Collapse/Expand button */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className={`flex items-center justify-center w-8 h-8 mx-auto mt-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition-all`}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? (
              <ChevronRight size={16} />
            ) : (
              <ChevronLeft size={16} />
            )}
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;