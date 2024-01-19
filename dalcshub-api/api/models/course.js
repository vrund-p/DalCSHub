// Authors: Shiwen(Lareina)

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const courseSchema = new Schema(
  {
    subject: {
      type: String,
      required: true,
    },
    number: {
      type: Number,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    credit_hours: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    flags: Array,
  },
  { timestamps: true },
);

// Create a compound index on 'subject' and 'number' fields to enforce uniqueness
courseSchema.index({ subject: 1, number: 1 }, { unique: true });

const Course = mongoose.model("courses", courseSchema);

module.exports = Course;
