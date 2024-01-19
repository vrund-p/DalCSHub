// Author: Meet Kumar Patel

const express = require("express");
const Reply = require("../models/reply");
const router = express.Router();

// get all comments
router.get("/fetch", async (req, res) => {
  try {
    // Find all posts and sort based on the timeCreated field
    const replies = await Reply.find().sort({ timeCreated: -1 });
    res.status(200).json({
      success: true,
      data: replies,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch comments" });
  }
});

// add comment
router.post("/addComment", async (req, res) => {
  try {
    const { replied_post_id, author_name, date, commentDescription} = req.body;

    if (!replied_post_id || !author_name || !commentDescription || !date ) {
 
      return res.status(400).json({ success: false, message: "Incorrect request" });
    }
    
    const newComment = await Reply.create({
      replied_post_id: replied_post_id,
      author_name: author_name,
      commentDescription: commentDescription,
      timeCreated: date,
    });
    res.status(200).json({ success: true, data: newComment });
  } catch (error) {
    console.error("Error creating comment:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

module.exports = router;