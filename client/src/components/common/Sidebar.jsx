import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { 
  Megaphone, 
  Network, 
  MessageCircle, 
  Heart, 
  User 
} from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    { path: '/announcements', icon: Megaphone, label: 'Announcements' },
    { path: '/network', icon: Network, label: 'Network Hub' },
    { path: '/discussion', icon: MessageCircle, label: 'Discussion' },
    { path: '/donation', icon: Heart, label: 'Donations' },
    { path: '/profile', icon: User, label: 'Profile' },
  ];

  return (
    <div className="fixed left-0 top-16 h-screen w-64 bg-white border-r border-gray-200 px-4 py-6">
      <div className="space-y-2">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                isActive 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default Sidebar;