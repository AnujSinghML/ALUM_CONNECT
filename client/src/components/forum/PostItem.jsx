import React, { useState, useEffect } from "react";
import axios from "axios";
import VoteButtons from "./VoteButtons";
import ReplyForm from "./ReplyForm";
import ReplyList from "./ReplyList";
import { formatDate, timeAgo, formatDateTime } from "../../utils/utils";

const PostItem = ({ post, user, setPosts }) => {
  const [replies, setReplies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

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

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6 border border-gray-200 transition-shadow hover:shadow-lg">
      <div className="mb-4">
        <h3 className="text-xl font-bold text-gray-800 mb-2">{post.title}</h3>
        <p className="text-gray-700 whitespace-pre-line">{post.content}</p>
      </div>
      
      <div className="flex justify-between items-center text-sm text-gray-500 mt-4 pb-4 border-b border-gray-100">
        <div className="flex items-center">
          <span className="font-medium text-gray-600">
            {/* {post.author?.name || "Anonymous"} */}
            {post.author ? post.author : "Anonymous"}
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
        <VoteButtons post={post} user={user} setPosts={setPosts} />
      </div>

      <div className="mt-4 space-y-4">
        <ReplyForm postId={post._id} setReplies={setReplies} user={user} />
        
        {isLoading ? (
          <div className="text-center py-3 text-gray-500">Loading replies...</div>
        ) : (
          <ReplyList replies={replies} user={user} setReplies={setReplies} />
        )}
      </div>
    </div>
  );
};

export default PostItem;