// Authors: Kent Chew & Khaled Al-Mahbashi
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const postSchema = new Schema({
  postTitle: { type: String, required: true },
  postDescription: { type: String, required: true },
  postAuthor: { type: String, required: true },
  postRating: { type: Number, required: true, default: 0 },
  likedBy: { type: Array, required: true },
  timeCreated: { type: Date, required: true },
  courseId: { type: Number, required: true },
});

const Post = mongoose.model("posts", postSchema);

module.exports = Post;
