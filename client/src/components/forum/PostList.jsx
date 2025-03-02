import React from "react";
import PostItem from "./PostItem";

const PostList = ({ posts, user, setPosts }) => {
  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Discussions</h2>
      {posts.length === 0 ? (
        <p className="text-gray-500">No discussions yet. Be the first to post!</p>
      ) : (
        posts.map((post) => <PostItem key={post._id} post={post} user={user} setPosts={setPosts} />)
      )}
    </div>
  );
};

export default PostList;
