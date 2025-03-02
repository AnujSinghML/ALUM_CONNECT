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

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_backend_URL}/auth/profile`, { withCredentials: true });
        setUser(response.data);
      } catch (error) {
        console.error("❌ Error fetching user:", error);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_backend_URL}/api/forum/posts`);
        setPosts(response.data);
      } catch (error) {
        console.error("❌ Error fetching posts:", error);
        setErrorMessage("Failed to load discussions. Please try again later.");
      }
    };

    fetchPosts();
    const interval = setInterval(fetchPosts, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex flex-1 pt-16">
        <Sidebar />
        <div className="flex-1 ml-64 p-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Discussion Forum</h1>

          {errorMessage && <ErrorMessage message={errorMessage} />}
          <CreatePostForm user={user} setPosts={setPosts} />
          <PostList posts={posts} user={user} setPosts={setPosts} />
        </div>
      </div>
    </div>
  );
};

export default Discussion;
