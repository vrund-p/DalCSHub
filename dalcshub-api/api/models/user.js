// Authors: Vrund Patel and Shiwen(Lareina) Yang

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    type: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    followedCourses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course", // Course model
      },
    ],
    savedPosts: Array,
  },
  { timestamps: true },
);

const User = mongoose.model("users", userSchema);

module.exports = User;
