import React, { useState } from "react";
import axios from "axios";

const CreatePostForm = ({ user, setPosts }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleCreatePost = async () => {
    // Reset previous errors
    setError("");

    // Validate inputs
    if (!user) {
      setError("You must be logged in to create a post.");
      return;
    }
    
    if (!title.trim()) {
      setError("Title cannot be empty.");
      return;
    }

    if (!content.trim()) {
      setError("Post content cannot be empty.");
      return;
    }

    if (title.length > 100) {
      setError("Title must be 100 characters or less.");
      return;
    }

    if (content.length > 1000) {
      setError("Post content must be 1000 characters or less.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_backend_URL}/api/forum/posts`,
        { 
          title, 
          content, 
          authorId: user.id 
        },
        { withCredentials: true }
      );

      // Prepend the new post to the list
      setPosts((prev) => [response.data, ...prev]);
      
      // Clear form
      setTitle("");
      setContent("");
      setError("");
    } catch (error) {
      console.error("❌ Error creating post:", error);
      setError(error.response?.data?.message || "Failed to create post. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-8 border border-gray-200">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Create a New Post</h2>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-md mb-4">
          {error}
        </div>
      )}
      
      <div className="space-y-4">
        <div>
          <input 
            type="text" 
            placeholder="Title" 
            value={title} 
            onChange={(e) => setTitle(e.target.value)}
            maxLength={100}
            className="border border-gray-300 p-3 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
          />
          <p className="text-xs text-gray-500 mt-1">{title.length}/100 characters</p>
        </div>
        
        <div>
          <textarea 
            placeholder="Write your post..." 
            value={content} 
            onChange={(e) => setContent(e.target.value)}
            maxLength={1000}
            className="border border-gray-300 p-3 w-full rounded-md h-32 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          ></textarea>
          <p className="text-xs text-gray-500 mt-1">{content.length}/1000 characters</p>
        </div>
        
        <div>
          <button 
            onClick={handleCreatePost} 
            disabled={isSubmitting}
            className={`px-5 py-3 rounded-md font-medium transition-colors duration-200 ${
              isSubmitting 
                ? "bg-blue-400 text-white cursor-not-allowed" 
                : "bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            }`}
          >
            {isSubmitting ? "Posting..." : "Create Post"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreatePostForm;