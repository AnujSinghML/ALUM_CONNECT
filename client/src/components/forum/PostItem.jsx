import React, { useState, useEffect } from "react";
import axios from "axios";
import VoteButtons from "./VoteButtons";
import ReplyForm from "./ReplyForm";
import ReplyList from "./ReplyList";
import { formatDate, timeAgo, formatDateTime } from "../../utils/utils";

const PostItem = ({ post, user, setPosts }) => {
  const [replies, setReplies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(post.title);
  const [editContent, setEditContent] = useState(post.content);

  // Modify the canModifyPost logic to prevent admin from editing
  const canModifyPost = user && (
    (user.id === post.authorId && user.role !== 'admin') || 
    (user.role === 'admin' && false) // Explicitly prevent editing for admin
  );

  const canDeletePost = user && (user.id === post.authorId || user.role === 'admin');

  useEffect(() => {
    const fetchReplies = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_backend_URL}/api/forum/posts/${post._id}/replies`
        );
        setReplies(response.data);
      } catch (error) {
        console.error("❌ Error fetching replies:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReplies();
  }, [post._id]);

  const handleEdit = async () => {
    if (!editTitle.trim() || !editContent.trim()) {
      return alert("Title and content cannot be empty.");
    }

    try {
      const response = await axios.put(
        `${import.meta.env.VITE_backend_URL}/api/forum/posts/${post._id}`,
        { title: editTitle, content: editContent },
        { withCredentials: true }
      );

      setPosts((prev) => 
        prev.map((p) => p._id === post._id ? response.data : p)
      );
      setIsEditing(false);
    } catch (error) {
      console.error("❌ Error updating post:", error);
      alert("Failed to update post. Please try again.");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    try {
      await axios.delete(
        `${import.meta.env.VITE_backend_URL}/api/forum/posts/${post._id}`,
        { withCredentials: true }
      );

      setPosts((prev) => prev.filter((p) => p._id !== post._id));
    } catch (error) {
      console.error("❌ Error deleting post:", error);
      alert("Failed to delete post. Please try again.");
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6 border border-gray-200 transition-shadow hover:shadow-lg">
      {isEditing ? (
        <div className="space-y-4">
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            className="w-full p-2 border rounded-md"
            placeholder="Edit post title"
          />
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            className="w-full p-2 border rounded-md h-32"
            placeholder="Edit post content"
          />
          <div className="flex space-x-2">
            <button 
              onClick={handleEdit}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Save Changes
            </button>
            <button 
              onClick={() => setIsEditing(false)}
              className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="mb-4">
            <h3 className="text-xl font-bold text-gray-800 mb-2">{post.title}</h3>
            <p className="text-gray-700 whitespace-pre-line">{post.content}</p>
          </div>
          
          <div className="flex justify-between items-center text-sm text-gray-500 mt-4 pb-4 border-b border-gray-100">
            <div className="flex items-center">
              <span className="font-medium text-gray-600">
                {post.author || "Anonymous"}
              </span>
              <span className="mx-2">•</span>
              <span 
                title={formatDateTime(post.createdAt)}
                className="hover:underline cursor-help"
              >
                {timeAgo(post.createdAt)}
              </span>
              {post.updatedAt && post.updatedAt !== post.createdAt && (
                <span className="ml-2 text-xs italic text-gray-400" 
                  title={`Last updated: ${formatDateTime(post.updatedAt)}`}
                >
                  (edited)
                </span>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <VoteButtons post={post} user={user} setPosts={setPosts} />
              {canModifyPost && (
                <button 
                  onClick={() => setIsEditing(true)}
                  className="text-blue-600 hover:text-blue-800 transition-colors"
                  title="Edit post"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                    <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
                  </svg>
                </button>
              )}
              {canDeletePost && (
                <button 
                  onClick={handleDelete}
                  className="text-red-600 hover:text-red-800 transition-colors"
                  title="Delete post"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          <div className="mt-4 space-y-4">
            <ReplyForm postId={post._id} setReplies={setReplies} user={user} />
            
            {isLoading ? (
              <div className="text-center py-3 text-gray-500">Loading replies...</div>
            ) : (
              <ReplyList 
                replies={replies} 
                user={user} 
                postId={post._id}
                setReplies={setReplies} 
              />
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default PostItem;