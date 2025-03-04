import React, { useState } from "react";
import axios from "axios";
import { formatDateTime, timeAgo } from "../../utils/utils";

const ReplyList = ({ replies, user, postId, setReplies }) => {
  const [isVoting, setIsVoting] = useState(false);

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
                </div>
                
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
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReplyList;