// // client/src/context/UserContext.jsx
// import React, { createContext, useState, useContext, useEffect } from 'react';
// import axios from 'axios';

// const UserContext = createContext();

// export const UserProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchUser = async () => {
//       try {
//         const response = await axios.get(`${import.meta.env.VITE_backend_URL}/auth/profile`, {
//           withCredentials: true
//         });
//         setUser(response.data);
//       } catch (error) {
//         console.error('Error fetching user:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchUser();
//   }, []);

//   return (
//     <UserContext.Provider value={{ user, setUser, loading }}>
//       {children}
//     </UserContext.Provider>
//   );
// };

// export const useUser = () => {
//   const context = useContext(UserContext);
//   if (context === undefined) {
//     throw new Error('useUser must be used within a UserProvider');
//   }
//   return context;
// };
// client/src/context/UserContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUser = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_backend_URL}/auth/profile`, 
        { withCredentials: true }
      );
      setUser(response.data);
      setError(null);
    } catch (error) {
      console.error('Error fetching user:', error);
      setError(error.response?.data?.error || 'Failed to fetch user profile');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Handle Google OAuth login
  const handleGoogleLogin = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_backend_URL}/auth/profile`,
        { withCredentials: true }
      );
      
      if (response.data) {
        setUser(response.data);
        localStorage.setItem('cachedUserProfile', JSON.stringify(response.data));
        setError(null);
      }
    } catch (error) {
      console.error('Failed to get user profile:', error);
      setError(error.response?.data?.error || 'Failed to authenticate with Google');
      setUser(null);
    }
  };

  // Handle logout
  const logout = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_backend_URL}/auth/logout`,
        {}, 
        { withCredentials: true }
      );
      setUser(null);
      localStorage.removeItem('cachedUserProfile');
      setError(null);
    } catch (error) {
      console.error('Logout error:', error);
      setError(error.response?.data?.error || 'Failed to logout');
    }
  };

  useEffect(() => {
    // Try to get user from cached profile first
    const cachedProfile = localStorage.getItem('cachedUserProfile');
    if (cachedProfile) {
      setUser(JSON.parse(cachedProfile));
      setLoading(false);
    }
    
    // Then fetch fresh data
    fetchUser();
  }, []);

  const value = {
    user,
    setUser,
    loading,
    error,
    handleGoogleLogin,
    logout,
    refreshUser: fetchUser
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};