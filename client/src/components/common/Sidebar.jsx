import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Megaphone, Network, MessageCircle, Heart, User, LogOut, ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { useUser } from '../../context/UserContext';

// Component for sidebar menu item
const SidebarItem = ({ icon: Icon, label, path, active, collapsed, onClick }) => {
  // Use a direct function that only passes the path
  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onClick(path);
  };

  return (
    <button
      onClick={handleClick}
      className={`flex items-center w-full py-4 px-5 rounded-xl text-base font-medium transition-all duration-200 group relative cursor-pointer ${
        active 
          ? "bg-blue-500 text-white" 
          : "text-gray-600 hover:bg-gray-100 hover:text-gray-800"
      }`}
    >
      <div className="flex items-center justify-center">
        <Icon size={collapsed ? 26 : 22} className={`transition-all ${!active && "text-gray-500 group-hover:text-gray-800"}`} />
      </div>
      
      {!collapsed && (
        <span className="ml-4 transition-opacity duration-200">
          {label}
        </span>
      )}
      
      {/* Active indicator dot */}
      {active && (
        <div className={`absolute ${collapsed ? "right-2.5" : "right-4"} top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-white`} />
      )}

      {/* Arrow on hover (for non-collapsed state) */}
      {!collapsed && !active && (
        <div className="absolute right-4 opacity-0 group-hover:opacity-100 transition-opacity">
          <ArrowRight size={16} className="text-gray-400" />
        </div>
      )}

      {/* Tooltip for collapsed state */}
      {collapsed && (
        <div className="absolute left-full ml-3 px-3 py-1.5 bg-gray-800 text-white text-sm rounded opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap z-20">
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
  
  // Use local storage to persist collapsed state
  const [collapsed, setCollapsed] = useState(() => {
    const savedState = localStorage.getItem('sidebar-collapsed');
    return savedState === 'true';
  });
  
  // Update local storage when collapsed state changes
  useEffect(() => {
    localStorage.setItem('sidebar-collapsed', String(collapsed));
  }, [collapsed]);
  
  // Handle responsive behavior - collapse on small screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setCollapsed(true);
        localStorage.setItem('sidebar-collapsed', 'true');
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
    document.body.style.setProperty('--sidebar-width', collapsed ? '100px' : '320px');
    
    // Update body classes for layout adjustments
    if (collapsed) {
      document.body.classList.add('sidebar-collapsed');
      document.body.classList.remove('sidebar-expanded');
      
      // Also update any parent elements
      const layoutElement = document.querySelector('.has-sidebar');
      if (layoutElement) {
        layoutElement.classList.add('sidebar-collapsed');
        layoutElement.classList.remove('sidebar-expanded');
      }
    } else {
      document.body.classList.add('sidebar-expanded');
      document.body.classList.remove('sidebar-collapsed');
      
      // Also update any parent elements
      const layoutElement = document.querySelector('.has-sidebar');
      if (layoutElement) {
        layoutElement.classList.add('sidebar-expanded');
        layoutElement.classList.remove('sidebar-collapsed');
      }
    }
    
    // Update main content margin
    const mainContent = document.getElementById('main-content');
    if (mainContent) {
      mainContent.style.marginLeft = collapsed ? '100px' : '320px';
      mainContent.style.transition = 'margin-left 0.3s ease';
    }
  }, [collapsed]);

  // Simple navigation that doesn't affect sidebar state
  const handleNavigation = useCallback((path) => {
    // Use navigate without changing collapsed state
    navigate(path);
  }, [navigate]);

  // Logout handler
  const handleLogout = useCallback((e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
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

  // Toggle sidebar without side effects
  const toggleSidebar = useCallback(() => {
    setCollapsed(prev => !prev);
  }, []);

  return (
    <aside 
      className={`fixed left-0 top-16 h-[calc(100vh-4rem)] bg-white border-r border-gray-200 shadow-sm z-30 transition-all duration-300 ease-in-out ${
        collapsed ? "w-[100px]" : "w-[320px]"
      }`}
      id="sidebar"
    >
      <div className="flex flex-col h-full">
        {/* Navigation */}
        <nav className="flex-1 px-4 py-8 space-y-4 overflow-hidden">
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
                onClick={handleNavigation}
              />
            );
          })}
        </nav>

        {/* User profile section */}
        <div className={`mt-auto border-t border-gray-200 p-5 ${collapsed ? "flex flex-col items-center" : ""}`}>
          <div className={`flex items-center ${collapsed ? "justify-center flex-col" : ""} mb-4 p-3 rounded-xl hover:bg-gray-100 transition-all`}>
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium text-lg">
              {user?.name?.charAt(0) || 'U'}
            </div>
            {!collapsed && (
              <div className="ml-4 truncate">
                <p className="text-base font-medium text-gray-700 truncate">{user?.name || 'User'}</p>
                <p className="text-sm text-gray-500 truncate">{user?.email || 'user@example.com'}</p>
              </div>
            )}
          </div>
          
          {/* Logout button */}
          <button 
            onClick={handleLogout}
            className={`flex items-center w-full py-3 px-4 text-base text-red-500 hover:bg-red-50 rounded-xl transition-all group cursor-pointer ${
              collapsed ? "justify-center" : ""
            }`}
          >
            <LogOut size={collapsed ? 24 : 22} />
            {!collapsed && <span className="ml-3">Logout</span>}
            
            {/* Tooltip for collapsed state */}
            {collapsed && (
              <div className="absolute left-full ml-3 px-3 py-1.5 bg-gray-800 text-white text-sm rounded opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap z-20">
                Logout
              </div>
            )}
          </button>
          
          {/* Collapse/Expand button */}
          <button
            onClick={toggleSidebar}
            className={`flex items-center justify-center w-12 h-12 mx-auto mt-4 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition-all cursor-pointer`}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? (
              <ChevronRight size={22} />
            ) : (
              <ChevronLeft size={22} />
            )}
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;