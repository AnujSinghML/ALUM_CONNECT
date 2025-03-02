import React from "react";
import { formatDate, timeAgo, formatDateTime } from "../../utils/utils";

const ReplyList = ({ replies, user, setReplies }) => {
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
                    {/* {reply.author || "Anonymous"} */}
                    {/* {reply.author} */}
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
                
                {user && user.id === reply.authorId && (
                  <button 
                    className="text-xs text-gray-400 hover:text-red-500 transition-colors"
                    onClick={() => {/* Optional delete functionality */}}
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReplyList;