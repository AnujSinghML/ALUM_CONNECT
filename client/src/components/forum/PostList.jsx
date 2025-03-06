// client\src\components\forum\PostList.jsx
import React from "react";
import PostItem from "./PostItem";

const PostList = ({ posts, user, setPosts }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-gray-200 pb-3">
        <h2 className="text-2xl font-bold text-gray-800">Recent Discussions</h2>
        <span className="text-sm text-gray-500">{posts.length} posts</span>
      </div>
      
      {posts.length === 0 ? (
        <div className="bg-gray-50 rounded-lg p-8 text-center border border-gray-200">
          <p className="text-gray-600 mb-2">No discussions yet.</p>
          <p className="text-gray-500 text-sm">Be the first to start a conversation!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {posts.map((post) => (
            <PostItem 
              key={post._id} 
              post={post} 
              user={user} 
              setPosts={setPosts} 
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default PostList;