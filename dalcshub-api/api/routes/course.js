// Authors: Shiwen(Lareina), Kent

const express = require("express");
const Course = require("../models/course");

const router = express.Router();

// Lareina: Get call to fetch all courses
router.get("/all", async (req, res) => {
  try {
    // find all courses and sorting based on the course number
    const courses = await Course.find().sort({ number: 1 });
    res.status(200).json({
      success: true,
      data: courses,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch courses" });
  }
});

// Lareina: Post call to fetch specific courses based on ids
router.post("/get_by_ids", async (req, res) => {
    const body = req.body;

    try {
      if (!body || Object.keys(body).length == 0 || !Array.isArray(body.courseIds)) {
        return res.status(400).json({ success: false,  error: 'Incorrect Request!' });
      }
    } catch (err) {
      return res.status(500).json({ message: "Internal server error!" });
    }

    try {
      Course.find({ _id: { $in: body.courseIds } })
        .sort({ number: 1 })
        .then((courses) => res.status(200).json({ success: true, data: courses}))
        .catch((err) => res.status(500).json({ success: false, error: 'Error fetching courses' }));
    } catch (error) {
      console.log(error)
      return res.status(500).json({ success: false, message: "Failed to fetch courses" });
    }
});

// Lareina: POST call to create a new course
router.post("/add", async (req, res) => {
    const body = req.body;

    try {
    if (Object.keys(body).length == 0) {
      return res.status(404).json({ success: false, data: "Incorrect Request!" });
    }
  } catch (err) {
    return res.status(500).json({ message: "Internal server error!" });
    }

    let newCourse = await new Course(body);

  newCourse
    .save()
    .then((result) => {
        return res.status(200).json({
            newCourse: result,
            success: true,
        message: "Course successfully added.",
        });
    })
    .catch((err) => {
      if (err.code === 11000) {
        // MongoDB error code for duplicate key
        return res.status(409).json({ success: false, message: "Course already exists." });
      }
      return res.status(400).send({ message: "Course request cannot be submitted" + err });
    });
});

// Kent: GET call to get course based on course number
router.get("/:courseNumber", async (req, res) => {
  const courseNumber = req.params.courseNumber;

  try {
    const course = await Course.findOne({ number: courseNumber });
    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }
    res.status(200).json({ success: true, data: course });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

module.exports = router;
