// import React from 'react';
// import Layout from '../components/common/Layout';

// const ComponentName = () => {
//   return (
//     <Layout>
//       <div className="bg-white rounded-lg shadow-sm p-6">
//         <h1 className="text-2xl font-bold text-gray-800 mb-6">Sasta Reddit</h1>
//         {/* Component content here */}
//       </div>
//     </Layout>
//   );
// };

import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/common/Navbar";
import Sidebar from "../components/common/Sidebar";
import PostList from "../components/forum/PostList";
import CreatePostForm from "../components/forum/CreatePostForm";
import ErrorMessage from "../components/common/ErrorMessage";

const Discussion = () => {
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Fetch current user data
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_backend_URL}/auth/profile`, 
          { withCredentials: true }
        );
        setUser(response.data);
      } catch (error) {
        console.error("❌ Error fetching user:", error);
        // User might not be logged in, which is OK
      }
    };

    fetchUser();
  }, []);

  // Fetch posts with periodic refresh
  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_backend_URL}/api/forum/posts`
        );
        setPosts(response.data);
        setErrorMessage("");
      } catch (error) {
        console.error("❌ Error fetching posts:", error);
        setErrorMessage("Failed to load discussions. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
    
    // Set up periodic refresh
    const interval = setInterval(fetchPosts, 30000); // Refresh every 30 seconds
    
    // Clean up interval on component unmount
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col h-screen bg-gray-100 overflow-hidden">
      <Navbar />
      
      <div className="flex flex-1 pt-16 overflow-hidden">
        <Sidebar />
        
        <main className="flex-1 ml-64 overflow-auto h-full">
          <div className="p-8 max-w-5xl mx-auto">
            <header className="mb-8">
              <h1 className="text-3xl font-bold text-gray-800">Discussion Forum</h1>
              <p className="text-gray-600 mt-2">
                Join the conversation and share your thoughts with the community
              </p>
            </header>

            {errorMessage && (
              <div className="mb-6">
                <ErrorMessage message={errorMessage} />
              </div>
            )}

            {!user && (
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6 rounded-md">
                <p className="text-blue-700">
                  Sign in to participate in discussions and create new posts.
                </p>
              </div>
            )}

            {user && (
              <section className="mb-8">
                <CreatePostForm user={user} setPosts={setPosts} />
              </section>
            )}

            <section className="pb-8">
              {isLoading && posts.length === 0 ? (
                <div className="bg-white p-8 rounded-lg shadow-sm text-center">
                  <p className="text-gray-500">Loading discussions...</p>
                </div>
              ) : (
                <PostList posts={posts} user={user} setPosts={setPosts} />
              )}
            </section>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Discussion;