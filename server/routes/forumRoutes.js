const express = require("express");
const router = express.Router();
const ForumPost = require("../models/ForumPost");
const { isAuthenticated } = require("../middleware/isAuthenticated");

// ✅ GET all posts
router.get("/posts", async (req, res) => {
  try {
    const posts = await ForumPost.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    console.error("❌ Error fetching posts:", error);
    res.status(500).json({ message: "Error fetching posts", error: error.message });
  }
});

// Create a new post
router.post("/posts", isAuthenticated, async (req, res) => {
  try {
    const { title, content } = req.body;
    const user = req.user; // User should be set by isAuthenticated middleware

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
    });

    await newPost.save();
    console.log("✅ Post Saved:", newPost);

    res.status(201).json(newPost);
  } catch (error) {
    console.error("❌ Error saving post:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});


module.exports = router;
