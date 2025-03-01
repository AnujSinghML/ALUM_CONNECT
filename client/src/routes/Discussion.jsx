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

const Discussion = () => {
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Fetch the authenticated user
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/auth/me`, { withCredentials: true });
        setUser(response.data);
      } catch (error) {
        console.error("❌ Error fetching user:", error);
      }
    };

    fetchUser();
  }, []);

  // Fetch posts and restore votes from localStorage
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/forum/posts`);
        const fetchedPosts = response.data;
        
        // Get stored votes from localStorage
        if (user) {
          const storedVotes = JSON.parse(localStorage.getItem(`userVotes_${user.id}`) || '{}');
          
          // Apply stored votes to fetched posts
          const postsWithStoredVotes = fetchedPosts.map(post => {
            if (storedVotes[post._id]) {
              return { ...post, userVote: storedVotes[post._id] };
            }
            return post;
          });
          
          setPosts(postsWithStoredVotes);
        } else {
          setPosts(fetchedPosts);
        }
      } catch (error) {
        console.error("❌ Error fetching posts:", error);
        setErrorMessage("Failed to load discussions. Please try again later.");
      }
    };    

    fetchPosts();
    
    // Set up polling for real-time updates (every 30 seconds)
    const interval = setInterval(fetchPosts, 30000);
    return () => clearInterval(interval);
  }, [user]);

  // Create a new post
  const handleCreatePost = async () => {
    if (!user) {
      setErrorMessage("You must be logged in to create a post");
      return;
    }

    if (!title.trim() || !content.trim()) {
      setErrorMessage("Title and content cannot be empty");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/forum/posts`,
        {
          title,
          content,
          authorId: user.id,
        },
        { withCredentials: true }
      );

      setPosts([response.data, ...posts]);
      setTitle("");
      setContent("");
    } catch (error) {
      console.error("❌ Error creating post:", error);
      setErrorMessage("Failed to create post. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Voting (Upvote / Downvote) with optimistic UI update and localStorage persistence
  const handleVote = async (postId, voteType) => {
    if (!user) {
      setErrorMessage("You must be logged in to vote");
      return;
    }
    
    // Get current votes from localStorage
    const storedVotes = JSON.parse(localStorage.getItem(`userVotes_${user.id}`) || '{}');
    
    // Update stored votes with new vote
    const updatedStoredVotes = {
      ...storedVotes,
      [postId]: voteType
    };
    
    // Save updated votes to localStorage
    localStorage.setItem(`userVotes_${user.id}`, JSON.stringify(updatedStoredVotes));
    
    // Optimistic update
    const updatedPosts = posts.map(post => {
      if (post._id === postId) {
        // Calculate new vote count optimistically
        let voteChange = 0;
        
        // If user hasn't voted yet
        if (!post.userVote) {
          voteChange = voteType === "upvote" ? 1 : -1;
        } 
        // If user is changing their vote
        else if (post.userVote !== voteType) {
          voteChange = voteType === "upvote" ? 2 : -2;
        }
        // If user is clicking the same vote button again (removing their vote)
        else if (post.userVote === voteType) {
          voteChange = voteType === "upvote" ? -1 : 1;
          // Remove vote from localStorage
          delete updatedStoredVotes[postId];
          localStorage.setItem(`userVotes_${user.id}`, JSON.stringify(updatedStoredVotes));
          return { 
            ...post, 
            voteCount: (post.voteCount || 0) + voteChange,
            userVote: null // Remove user's vote
          };
        }
        
        return { 
          ...post, 
          voteCount: (post.voteCount || 0) + voteChange,
          userVote: voteType // Track user's vote
        };
      }
      return post;
    });
    
    setPosts(updatedPosts);
    
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/forum/posts/${postId}/vote`,
        { voteType },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" }
        }
      );
      
      // Update with server response to correct any discrepancies
      setPosts(prevPosts =>
        prevPosts.map(post =>
          post._id === postId ? { ...post, voteCount: response.data.voteCount } : post
        )
      );
      
      console.log("✅ Vote successful:", response.data);
    } catch (error) {
      console.error("❌ Error updating vote:", error.response?.data || error.message);
      
      // Revert the optimistic update if error occurs
      setPosts(prevPosts => {
        return prevPosts.map(post => {
          if (post._id === postId) {
            // Reset to the previous state
            const originalPost = posts.find(p => p._id === postId);
            return originalPost;
          }
          return post;
        });
      });
      
      // Also revert the localStorage change
      localStorage.setItem(`userVotes_${user.id}`, JSON.stringify(storedVotes));
      
      setErrorMessage("Failed to update vote. Please try again.");
    }
  };

  // Format date function
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Calculate time ago function
  const timeAgo = (dateString) => {
    if (!dateString) return "";
    
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
    
    return formatDate(dateString);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex flex-1 pt-16">
        <Sidebar />
        
        {/* Main content area */}
        <div className="flex-1 ml-64 p-6">
          {/* Header with gradient background */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-t-lg p-8 shadow-lg relative overflow-hidden">
            <div className="absolute inset-0 bg-black opacity-10"></div>
            <div className="relative z-10">
              <h1 className="text-3xl font-bold text-white mb-3">Discussion Forum</h1>
              <p className="text-blue-100 text-lg max-w-2xl">
                Share ideas, ask questions, and connect with your IIIT-N community
              </p>
            </div>
            {/* Decorative elements */}
            <div className="absolute right-8 bottom-8 opacity-20">
              <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
            </div>
          </div>
          
          {/* Main content */}
          <div className="bg-white rounded-b-lg shadow-lg p-6">
            {errorMessage && (
              <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6 rounded-md">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{errorMessage}</p>
                  </div>
                </div>
              </div>
            )}
            
            {/* Create Post Section */}
            <div className="mb-10">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Create a New Post
              </h2>
              
              {user ? (
                <div className="bg-gray-50 rounded-lg p-6 border border-gray-200 shadow-sm hover:shadow-md transition duration-200">
                  <div className="mb-4">
                    <input
                      type="text"
                      placeholder="What's your question or topic?"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="border border-gray-300 rounded-lg p-3 w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition shadow-sm"
                    />
                  </div>
                  
                  <div className="mb-5">
                    <textarea
                      placeholder="Share your thoughts or questions with the community..."
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      className="border border-gray-300 rounded-lg p-3 w-full h-32 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition resize-none shadow-sm"
                    />
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Posting as <span className="font-medium text-blue-600">{user.name || user.username || "User"}</span></span>
                    <button 
                      onClick={handleCreatePost} 
                      disabled={isSubmitting}
                      className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-2 rounded-full font-medium transition shadow-md hover:shadow-lg disabled:opacity-50 flex items-center"
                    >
                      {isSubmitting ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Posting...
                        </>
                      ) : (
                        <>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                          </svg>
                          Post Discussion
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-5 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mr-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <div>
                    <h3 className="font-semibold text-blue-800 mb-1">Sign in to join the conversation</h3>
                    <p className="text-blue-600 text-sm">Login to share your thoughts and interact with other community members.</p>
                  </div>
                </div>
              )}
            </div>
            
            {/* Posts Section */}
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                </svg>
                Recent Discussions
              </h2>
              
              {posts.length === 0 ? (
                <div className="text-center p-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <h3 className="text-lg font-medium text-gray-700 mb-2">No discussions yet</h3>
                  <p className="text-gray-500 max-w-md mx-auto">Be the first to start a conversation in the community! Share your thoughts, questions, or ideas.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {posts.map((post) => (
                    <div key={post._id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 transition hover:shadow-md">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-xl font-bold text-gray-800 hover:text-blue-600 transition">{post.title}</h3>
                        <div className="flex flex-col items-end">
                          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                            {timeAgo(post.createdAt)}
                          </span>
                        </div>
                      </div>
                      
                      <div className="prose prose-blue max-w-none mb-6 text-gray-700">
                        <p>{post.content}</p>
                      </div>
                      
                      <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                        <div className="flex items-center">
                          <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full w-9 h-9 flex items-center justify-center font-medium mr-3">
                            {(post.author?.[0] || "A").toUpperCase()}
                          </div>
                          <span className="text-sm font-medium text-gray-800">
                            {post.author || "Anonymous"}
                          </span>
                        </div>
                        
                        <div className="flex items-center space-x-6">
                          <div className="flex items-center space-x-1">
                            <button 
                              onClick={() => handleVote(post._id, "upvote")}
                              className="flex items-center justify-center w-8 h-8 rounded-full transition hover:bg-gray-100"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" 
                                fill="none" 
                                viewBox="0 0 24 24" 
                                stroke={post.userVote === 'upvote' ? '#3b82f6' : 'currentColor'}
                                strokeWidth={post.userVote === 'upvote' ? 2.5 : 2}
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
                              </svg>
                            </button>
                            
                            <span className="font-medium text-gray-700">{post.voteCount || 0}</span>
                            
                            <button 
                              onClick={() => handleVote(post._id, "downvote")}
                              className="flex items-center justify-center w-8 h-8 rounded-full transition hover:bg-gray-100"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" 
                                fill="none" 
                                viewBox="0 0 24 24" 
                                stroke={post.userVote === 'downvote' ? '#3b82f6' : 'currentColor'}
                                strokeWidth={post.userVote === 'downvote' ? 2.5 : 2}
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                              </svg>
                            </button>
                          </div>
                          
                          <button className="flex items-center text-gray-500 hover:text-blue-600 transition">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                            </svg>
                            Reply
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Discussion;