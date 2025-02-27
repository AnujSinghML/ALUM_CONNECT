const mongoose = require("mongoose");

const forumPostSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: String, required: true },
  authorId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
  createdAt: { type: Date, default: Date.now },
  votes: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      voteType: { type: String, enum: ["upvote", "downvote"] } // Only "upvote" or "downvote"
    }
  ]
});

// ✅ Virtual field to calculate total votes
forumPostSchema.virtual("voteCount").get(function () {
  return this.votes.reduce((total, vote) => (vote.voteType === "upvote" ? total + 1 : total - 1), 0);
});

const ForumPost = mongoose.model("ForumPost", forumPostSchema);
module.exports = ForumPost;
