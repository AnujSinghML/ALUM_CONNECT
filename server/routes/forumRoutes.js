const express = require("express");
const router = express.Router();
const ForumPost = require("../models/ForumPost");
const { isAuthenticated } = require("../middleware/isAuthenticated");

// ✅ GET all posts (including votes)
router.get("/posts", async (req, res) => {
  try {
    const posts = await ForumPost.find().sort({ createdAt: -1 });

    // Include vote counts in the response
    const postsWithVotes = posts.map(post => ({
      ...post.toObject(),
      voteCount: post.votes.filter(vote => vote.voteType === "upvote").length -
                 post.votes.filter(vote => vote.voteType === "downvote").length
    }));

    res.json(postsWithVotes);
  } catch (error) {
    console.error("❌ Error fetching posts:", error);
    res.status(500).json({ message: "Error fetching posts" });
  }
});

// ✅ Get a post with replies
router.get("/posts/:postId", async (req, res) => {
  try {
    const post = await ForumPost.findById(req.params.postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.json(post);
  } catch (error) {
    console.error("❌ Error fetching post:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Create a new post (Requires Authentication)
router.post("/posts", isAuthenticated, async (req, res) => {
  try {
    const { title, content } = req.body;
    const user = req.user; // User should be set by `isAuthenticated`

    console.log("🔍 Incoming Data:", req.body);
    console.log("👤 Authenticated User:", user);

    if (!title || !content || !user.id) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newPost = new ForumPost({
      title,
      content,
      author: user.name,
      authorId: user.id,
      votes: [], // Initialize votes as an empty array
    });

    await newPost.save();
    console.log("✅ Post Saved:", newPost);

    res.status(201).json(newPost);
  } catch (error) {
    console.error("❌ Error saving post:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/posts/:postId/vote", isAuthenticated, async (req, res) => {
  try {
    const { postId } = req.params;
    const { voteType } = req.body;
    const userId = req.user._id; // Ensure req.user is set by authentication middleware

    if (!["upvote", "downvote"].includes(voteType)) {
      return res.status(400).json({ message: "Invalid vote type" });
    }

    const post = await ForumPost.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // ✅ Find if the user already voted
    const existingVoteIndex = post.votes.findIndex(vote => vote.userId.equals(userId));

    if (existingVoteIndex !== -1) {
      // ✅ If user already voted, update or remove their vote
      if (post.votes[existingVoteIndex].voteType === voteType) {
        post.votes.splice(existingVoteIndex, 1); // Remove vote if same type
      } else {
        post.votes[existingVoteIndex].voteType = voteType; // Update vote
      }
    } else {
      // ✅ If user hasn't voted, add new vote
      post.votes.push({ userId, voteType });
    }

    await post.save();

    res.json({ message: "Vote updated successfully", voteCount: post.voteCount });
  } catch (error) {
    console.error("Vote error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/posts/:postId/replies", isAuthenticated, async (req, res) => {
  try {
    const { postId } = req.params;
    const { content } = req.body;
    const user = req.user; // Make sure req.user exists (authentication middleware)

    if (!content || !user) {
      return res.status(400).json({ message: "Reply content is required" });
    }

    const post = await ForumPost.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const reply = {
      userId: user._id,
      username: user.name,
      content,
      createdAt: new Date(),
      votes: [], // Initialize empty votes array
      postId: postId, // Add postId to the reply
    };

    post.replies.push(reply);
    await post.save();

    res.status(201).json(post.replies);
  } catch (error) {
    console.error("❌ Error saving reply:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/posts/:postId/replies/:replyId/vote", isAuthenticated, async (req, res) => {
  try {
    const { postId, replyId } = req.params;
    const { voteType } = req.body;
    const userId = req.user._id;

    if (!["upvote", "downvote"].includes(voteType)) {
      return res.status(400).json({ message: "Invalid vote type" });
    }

    const post = await ForumPost.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const reply = post.replies.id(replyId);
    if (!reply) {
      return res.status(404).json({ message: "Reply not found" });
    }

    // Find if the user already voted on this reply
    const existingVoteIndex = reply.votes.findIndex(vote => vote.userId.equals(userId));

    if (existingVoteIndex !== -1) {
      // If user already voted, update or remove their vote
      if (reply.votes[existingVoteIndex].voteType === voteType) {
        reply.votes.splice(existingVoteIndex, 1); // Remove vote if same type
      } else {
        reply.votes[existingVoteIndex].voteType = voteType; // Update vote
      }
    } else {
      // If user hasn't voted, add new vote
      reply.votes.push({ userId, voteType });
    }

    await post.save();

    // Calculate vote count for the specific reply
    const voteCount = reply.voteCount;

    res.json({ 
      message: "Reply vote updated successfully", 
      voteCount,
      replyId
    });
  } catch (error) {
    console.error("Reply vote error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Update the replies fetching route to ensure vote count is included
router.get("/posts/:postId/replies", async (req, res) => {
  try {
    const { postId } = req.params;
    const post = await ForumPost.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Map replies to include voteCount
    const repliesWithVotes = post.replies.map(reply => ({
      ...reply.toObject(),
      voteCount: reply.voteCount,
      postId: post._id
    }));

    res.json(repliesWithVotes);
  } catch (error) {
    console.error("❌ Error fetching replies:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
