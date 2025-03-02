import React, { useState } from "react";
import axios from "axios";

const CreatePostForm = ({ user, setPosts }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreatePost = async () => {
    if (!user) return alert("You must be logged in to create a post.");
    if (!title.trim() || !content.trim()) return alert("Title and content cannot be empty.");

    setIsSubmitting(true);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_backend_URL}/api/forum/posts`,
        { title, content, authorId: user.id },
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
    <div className="bg-white p-4 rounded-lg shadow mb-6 border">
      <h2 className="text-lg font-semibold mb-3">Create a New Post</h2>
      <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)}
        className="border p-2 w-full mb-2 rounded" />
      <textarea placeholder="Write your post..." value={content} onChange={(e) => setContent(e.target.value)}
        className="border p-2 w-full rounded h-24"></textarea>
      <button onClick={handleCreatePost} disabled={isSubmitting}
        className="bg-blue-500 text-white px-4 py-2 mt-2 rounded">
        {isSubmitting ? "Posting..." : "Post"}
      </button>
    </div>
  );
};

export default CreatePostForm;
