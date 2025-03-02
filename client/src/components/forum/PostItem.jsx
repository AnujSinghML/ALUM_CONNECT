import React from "react";
import VoteButtons from "./VoteButtons";
import { formatDate, timeAgo } from "../../utils/utils";

const PostItem = ({ post, user, setPosts }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow mb-4 border">
      <h3 className="text-lg font-bold">{post.title}</h3>
      <p className="text-gray-700">{post.content}</p>
      <div className="flex justify-between items-center text-sm text-gray-500 mt-2">
        <span>Posted by {post.author?.name || "Anonymous"} - {timeAgo(post.createdAt)}</span>
        <VoteButtons post={post} user={user} setPosts={setPosts} />
      </div>
    </div>
  );
};

export default PostItem;
