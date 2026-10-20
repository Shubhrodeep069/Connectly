
const express = require("express");
const Post = require("../models/Post");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Get all posts
router.get("/", async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("author", "name profilePicture")
      .populate("comments.user", "name profilePicture")
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch posts." });
  }
});

// Create a post
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { content, image } = req.body;

    if (!content?.trim() && !image?.trim()) {
      return res.status(400).json({
        message: "A post must contain text or an image."
      });
    }

    const post = await Post.create({
      author: req.userId,
      content: content?.trim() || "",
      image: image?.trim() || ""
    });

    const populatedPost = await Post.findById(post._id)
      .populate("author", "name profilePicture");

    res.status(201).json(populatedPost);
  } catch (error) {
    res.status(500).json({ message: "Failed to create post." });
  }
});

// Like or unlike a post
router.put("/:id/like", authMiddleware, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found." });
    }

    const alreadyLiked = post.likes.some(
      id => id.toString() === req.userId
    );

    if (alreadyLiked) {
      post.likes.pull(req.userId);
    } else {
      post.likes.addToSet(req.userId);
    }

    await post.save();

    res.json({
      message: alreadyLiked ? "Post unliked." : "Post liked.",
      likesCount: post.likes.length,
      liked: !alreadyLiked
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to update like." });
  }
});

// Add a comment
router.post("/:id/comments", authMiddleware, async (req, res) => {
  try {
    const { text } = req.body;

    if (!text?.trim() || text.trim().length > 500) {
      return res.status(400).json({
        message: "Comment must contain 1–500 characters."
      });
    }

    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found." });
    }

    post.comments.push({
      user: req.userId,
      text: text.trim()
    });

    await post.save();

    const updatedPost = await Post.findById(post._id)
      .populate("author", "name profilePicture")
      .populate("comments.user", "name profilePicture");

    res.status(201).json(updatedPost);
  } catch (error) {
    res.status(500).json({ message: "Failed to add comment." });
  }
});

// Delete your own post
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found." });
    }

    if (post.author.toString() !== req.userId) {
      return res.status(403).json({
        message: "You can only delete your own posts."
      });
    }

    await post.deleteOne();

    res.json({ message: "Post deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete post." });
  }
});

module.exports = router;
