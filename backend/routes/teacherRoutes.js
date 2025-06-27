const express = require('express');
const router = express.Router();
const Course = require('../models/Course');

// POST /api/teacher/courses
router.post('/courses', async (req, res) => {
  const { title, description, teacherId } = req.body;

  try {
    const course = new Course({ title, description, teacher: teacherId });
    await course.save();
    res.status(201).json({ message: "Course created", course });
  } catch (err) {
    res.status(500).json({ error: "Failed to create course" });
  }
});

// GET /api/teacher/courses/:teacherId
router.get('/courses/:teacherId', async (req, res) => {
  try {
    const courses = await Course.find({ teacher: req.params.teacherId });
    res.json(courses);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch courses" });
  }
});

// DELETE /api/teacher/courses/:id
router.delete('/courses/:id', async (req, res) => {
  try {
    await Course.findByIdAndDelete(req.params.id);
    res.json({ message: "Course deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete course" });
  }
});

module.exports = router;
