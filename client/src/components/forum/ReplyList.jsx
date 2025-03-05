import React, { useState } from "react";
import axios from "axios";
import { formatDateTime, timeAgo } from "../../utils/utils";

const ReplyList = ({ replies, user, postId, setReplies }) => {
  const [isVoting, setIsVoting] = useState(false);
  const [editingReplyId, setEditingReplyId] = useState(null);
  const [editReplyContent, setEditReplyContent] = useState("");

  const handleReplyVote = async (replyId, voteType) => {
    if (!user) {
      return alert("You must be logged in to vote.");
    }
    
    if (isVoting) return;
    
    setIsVoting(true);
    
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_backend_URL}/api/forum/posts/${postId}/replies/${replyId}/vote`,
        { voteType },
        { withCredentials: true }
      );

      // Update the replies with the new vote count
      setReplies(prevReplies => 
        prevReplies.map(reply => 
          reply._id === replyId 
            ? { ...reply, voteCount: response.data.voteCount } 
            : reply
        )
      );
    } catch (error) {
      console.error("❌ Error voting on reply:", error);
      alert("Failed to update vote.");
    } finally {
      setIsVoting(false);
    }
  };

  const handleEditReply = async (replyId) => {
    if (!editReplyContent.trim()) {
      return alert("Reply content cannot be empty.");
    }

    try {
      const response = await axios.put(
        `${import.meta.env.VITE_backend_URL}/api/forum/posts/${postId}/replies/${replyId}`,
        { content: editReplyContent },
        { withCredentials: true }
      );

      setReplies(response.data);
      setEditingReplyId(null);
    } catch (error) {
      console.error("❌ Error updating reply:", error);
      alert("Failed to update reply. Please try again.");
    }
  };

  const handleDeleteReply = async (replyId) => {
    if (!window.confirm("Are you sure you want to delete this reply?")) return;

    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_backend_URL}/api/forum/posts/${postId}/replies/${replyId}`,
        { withCredentials: true }
      );

      setReplies(response.data);
    } catch (error) {
      console.error("❌ Error deleting reply:", error);
      alert("Failed to delete reply. Please try again.");
    }
  };

  // Determine if user can modify (edit) the reply
  const canModifyReply = (reply) => {
    return user && 
      (user.id === reply.userId && user.role !== 'admin');
  };

  // Determine if user can delete the reply
  const canDeleteReply = (reply) => {
    return user && 
      (user.id === reply.userId || user.role === 'admin');
  };

  return (
    <div className="mt-6 border-t border-gray-100 pt-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">
          Replies {replies.length > 0 && `(${replies.length})`}
        </h3>
      </div>

      {replies.length === 0 ? (
        <div className="py-4 text-center rounded-md bg-gray-50 border border-gray-100">
          <p className="text-gray-500">No replies yet. Be the first to respond!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {replies.map((reply, index) => (
            <div 
              key={reply._id || index} 
              className="p-4 bg-gray-50 rounded-lg border border-gray-100 transition-all hover:border-gray-200"
            >
              {editingReplyId === reply._id ? (
                <div className="space-y-3">
                  <textarea
                    className="w-full p-2 border rounded-md"
                    value={editReplyContent}
                    onChange={(e) => setEditReplyContent(e.target.value)}
                    placeholder="Edit your reply"
                    rows="3"
                  />
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => handleEditReply(reply._id)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                    >
                      Save Changes
                    </button>
                    <button 
                      onClick={() => setEditingReplyId(null)}
                      className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <p className="text-gray-800 mb-2 whitespace-pre-line">{reply.content}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-500 flex items-center">
                      <span className="font-medium text-gray-600">
                        {reply.username ? reply.username : "Anonymous"}
                      </span>
                      <span className="mx-2">•</span>
                      <span 
                        title={formatDateTime(reply.createdAt)} 
                        className="hover:underline cursor-help"
                      >
                        {timeAgo(reply.createdAt)}
                      </span>
                      {reply.updatedAt && reply.updatedAt !== reply.createdAt && (
                        <span className="ml-2 text-xs italic text-gray-400" 
                          title={`Last updated: ${formatDateTime(reply.updatedAt)}`}
                        >
                          (edited)
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center bg-gray-100 rounded-full px-2 py-1 border border-gray-200">
                        <button 
                          onClick={() => handleReplyVote(reply._id, "upvote")} 
                          className="text-gray-700 hover:text-green-600 transition-colors disabled:opacity-50"
                          disabled={isVoting}
                          title="Upvote"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                          </svg>
                        </button>
                        
                        <span className="mx-2 text-xs font-medium text-gray-700">
                          {reply.voteCount || 0}
                        </span>
                        
                        <button 
                          onClick={() => handleReplyVote(reply._id, "downvote")} 
                          className="text-gray-700 hover:text-red-600 transition-colors disabled:opacity-50"
                          disabled={isVoting}
                          title="Downvote"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M16.707 10.293a1 1 0 010 1.414l-6 6a1 1 0 01-1.414 0l-6-6a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l4.293-4.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>

                      {canModifyReply(reply) && (
                        <button 
                          onClick={() => {
                            setEditingReplyId(reply._id);
                            setEditReplyContent(reply.content);
                          }}
                          className="text-blue-600 hover:text-blue-800 transition-colors"
                          title="Edit reply"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                            <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
                          </svg>
                        </button>
                      )}
                      {canDeleteReply(reply) && (
                        <button 
                          onClick={() => handleDeleteReply(reply._id)}
                          className="text-red-600 hover:text-red-800 transition-colors"
                          title="Delete reply"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                        </button>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReplyList;
