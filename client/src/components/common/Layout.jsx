// import React from 'react';
// import Navbar from './Navbar';
// import Sidebar from './Sidebar';

// const Layout = ({ children }) => {
//   return (
//     <div className="min-h-screen bg-gray-50">
//       <Navbar />
//       <Sidebar />
//       <main className="ml-64 pt-16 p-8">
//         {children}
//       </main>
//     </div>
//   );
// };

// export default Layout;
// client/src/components/common/Layout.jsx
import React from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { useUser } from '../../context/UserContext'; // We'll create this

const Layout = ({ children }) => {
  const { user, loading } = useUser();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar userProfile={user} />
      <Sidebar />
      <main className="ml-64 pt-16 p-8">
        {children}
      </main>
    </div>
  );
};

export default Layout;