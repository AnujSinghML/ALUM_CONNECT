import React from "react";
import axios from "axios";

const VoteButtons = ({ post, user, setPosts }) => {
  const handleVote = async (postId, voteType) => {
    if (!user) return alert("You must be logged in to vote.");
    
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_backend_URL}/api/forum/posts/${postId}/vote`,
        { voteType },
        { withCredentials: true }
      );

      setPosts((prev) =>
        prev.map((p) => (p._id === postId ? { ...p, voteCount: response.data.voteCount } : p))
      );
    } catch (error) {
      console.error("❌ Error voting:", error);
      alert("Failed to update vote.");
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <button onClick={() => handleVote(post._id, "upvote")} className="text-green-500">▲ {post.voteCount}</button>
      <button onClick={() => handleVote(post._id, "downvote")} className="text-red-500">▼</button>
    </div>
  );
};

export default VoteButtons;
