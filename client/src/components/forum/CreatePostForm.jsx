import React, { useState } from "react";
import axios from "axios";

const CreatePostForm = ({ user, setPosts }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreatePost = async () => {
    if (!user) {
      return alert("You must be logged in to create a post.");
    }
    
    if (!title.trim() || !content.trim()) {
      return alert("Title and content cannot be empty.");
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

      setPosts((prev) => [response.data, ...prev]);
      setTitle("");
      setContent("");
    } catch (error) {
      console.error("❌ Error creating post:", error);
      alert("Failed to create post. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-8 border border-gray-200">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Create a New Post</h2>
      
      <div className="space-y-4">
        <div>
          <input 
            type="text" 
            placeholder="Title" 
            value={title} 
            onChange={(e) => setTitle(e.target.value)}
            className="border border-gray-300 p-3 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
          />
        </div>
        
        <div>
          <textarea 
            placeholder="Write your post..." 
            value={content} 
            onChange={(e) => setContent(e.target.value)}
            className="border border-gray-300 p-3 w-full rounded-md h-32 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          ></textarea>
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