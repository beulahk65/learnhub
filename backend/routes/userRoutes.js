// ✅ userRoutes.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const Section = require('../models/Section');

// ------------------ USER AUTH ------------------

router.post('/register', async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    const newUser = new User({ name, email, password, role });
    await newUser.save();
    res.status(201).json({ message: "User registered successfully!" });
  } catch {
    res.status(500).json({ error: "Failed to register user" });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || user.password !== password) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    res.json({ message: 'Login successful', user: { name: user.name, email: user.email, role: user.role } });
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

// ------------------ ADMIN ROUTES ------------------

router.get('/admin/users', async (req, res) => {
  try {
    const users = await User.find({}, '-password');
    res.json(users);
  } catch {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// ------------------ TEACHER ROUTES ------------------

router.get('/teacher/courses', async (req, res) => {
  const { email } = req.query;
  try {
    const courses = await Course.find({ teacherEmail: email });
    res.json(courses);
  } catch {
    res.status(500).json({ error: 'Failed to fetch courses' });
  }
});

router.post('/courses', async (req, res) => {
  const { title, description, teacherEmail } = req.body;
  try {
    const newCourse = new Course({ title, description, teacherEmail, students: [] });
    await newCourse.save();
    res.status(201).json({ message: 'Course created successfully' });
  } catch {
    res.status(500).json({ error: 'Failed to create course' });
  }
});

router.delete('/teacher/courses/:id', async (req, res) => {
  try {
    const deleted = await Course.findByIdAndUpdate(req.params.id, { isDeleted: true });
    if (!deleted) return res.status(404).json({ error: 'Course not found' });
    res.json({ message: 'Course deleted (soft)' });
  } catch {
    res.status(500).json({ error: 'Failed to delete course' });
  }
});


// ------------------ STUDENT ROUTES ------------------

router.post('/student/enroll', async (req, res) => {
  const { courseId, studentEmail } = req.body;
  try {
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ error: 'Course not found' });

    const alreadyEnrolled = await Enrollment.findOne({ courseId, studentEmail });
    if (alreadyEnrolled) return res.status(400).json({ error: 'Already enrolled' });

    const enrollment = new Enrollment({ courseId, studentEmail, progress: 0, completed: false });
    await enrollment.save();

    course.students.push(studentEmail);
    await course.save();

    res.json({ message: 'Enrolled successfully' });
  } catch {
    res.status(500).json({ error: 'Enrollment failed' });
  }
});

router.get('/student/enrollments', async (req, res) => {
  const { studentEmail } = req.query;
  try {
    const enrollments = await Enrollment.find({ studentEmail }).populate('courseId');
    res.json(enrollments);
  } catch {
    res.status(500).json({ error: 'Failed to fetch enrollments' });
  }
});

router.post('/student/complete-section', async (req, res) => {
  const { courseId, studentEmail, sectionId } = req.body;

  try {
    const enrollment = await Enrollment.findOne({ courseId, studentEmail });
    if (!enrollment) {
      return res.status(404).json({ error: 'Enrollment not found' });
    }

    if (!enrollment.completedSections) {
      enrollment.completedSections = [];
    }

    if (!enrollment.completedSections.includes(sectionId)) {
      enrollment.completedSections.push(sectionId);
    }

    const totalSections = await Section.countDocuments({ courseId });
    const completedCount = enrollment.completedSections.length;
    const progress = totalSections > 0 ? Math.round((completedCount / totalSections) * 100) : 0;

    enrollment.progress = progress;
    enrollment.completed = progress === 100;
    await enrollment.save();

    res.json({ message: 'Section marked as completed', progress });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update progress' });
  }
});

// ✅ Mark a Section as Completed by a Student
router.put('/student/complete-section', async (req, res) => {
  const { studentEmail, courseId, sectionId } = req.body;

  try {
    const enrollment = await Enrollment.findOne({ studentEmail, courseId });

    if (!enrollment) {
      return res.status(404).json({ error: 'Enrollment not found' });
    }

    // Avoid duplicates
    if (!enrollment.completedSections.includes(sectionId)) {
      enrollment.completedSections.push(sectionId);
      enrollment.progress = enrollment.completedSections.length;

      // Optional: mark as completed if all sections are done
      const totalSections = await Section.countDocuments({ courseId });
      if (enrollment.progress === totalSections) {
        enrollment.completed = true;
      }

      await enrollment.save();
    }

    res.json({ message: 'Section marked as completed', enrollment });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update progress' });
  }
});

// ✅ Mark course as completed by student
router.post('/student/complete', async (req, res) => {
  const { courseId, studentEmail } = req.body;
  try {
    const enrollment = await Enrollment.findOne({ courseId, studentEmail });
    if (!enrollment) return res.status(404).json({ error: 'Enrollment not found' });

    enrollment.completed = true;
    enrollment.progress = 100;
    await enrollment.save();

    res.json({ message: 'Course marked as completed' });
  } catch {
    res.status(500).json({ error: 'Failed to mark course as completed' });
  }
});


// ------------------ SECTION ROUTES ------------------

router.post('/teacher/courses/:courseId/sections', async (req, res) => {
  const { title, content, videoUrl } = req.body;
  try {
    const section = new Section({
      courseId: req.params.courseId,
      title,
      content,
      videoUrl
    });
    await section.save();
    res.status(201).json({ message: 'Section added successfully', section });
  } catch (err) {
    res.status(500).json({ error: 'Failed to add section' });
  }
});

router.get('/courses/:courseId/sections', async (req, res) => {
  try {
    const sections = await Section.find({ courseId: req.params.courseId });
    res.json(sections);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch sections' });
  }
});

router.delete('/sections/:id', async (req, res) => {
  try {
    const deleted = await Section.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Section not found' });
    }
    res.json({ message: 'Section deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete section' });
  }
});

// ------------------ PUBLIC ROUTES ------------------

router.get('/users', async (req, res) => {
  try {
    const users = await User.find({}, 'name email role');
    res.json(users);
  } catch {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

router.get('/courses', async (req, res) => {
  try {
    const courses = await Course.find({ isDeleted: { $ne: true } });
    res.json(courses);
  } catch {
    res.status(500).json({ error: 'Failed to fetch courses' });
  }
});


const PDFDocument = require('pdfkit');
const fs = require('fs');

// 📄 Download Certificate (PDF)
router.get('/student/certificate/:courseId', async (req, res) => {
  const { courseId } = req.params;
  const { studentEmail } = req.query;

  try {
    const enrollment = await Enrollment.findOne({ courseId, studentEmail }).populate('courseId');
    if (!enrollment || !enrollment.completed) {
      return res.status(403).json({ error: 'You must complete the course to download certificate' });
    }

    const doc = new PDFDocument();
    const fileName = `Certificate_${enrollment.courseId.title}_${studentEmail}.pdf`;

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);

    doc.pipe(res);

    doc.fontSize(24).text('🎓 Course Completion Certificate', { align: 'center' });
    doc.moveDown();
    doc.fontSize(16).text(`This is to certify that`, { align: 'center' });
    doc.moveDown();
    doc.fontSize(20).text(`${studentEmail}`, { align: 'center', underline: true });
    doc.moveDown();
    doc.fontSize(16).text(`has successfully completed the course`, { align: 'center' });
    doc.moveDown();
    doc.fontSize(20).text(`"${enrollment.courseId.title}"`, { align: 'center', underline: true });
    doc.moveDown(2);
    doc.fontSize(14).text(`Date: ${new Date().toLocaleDateString()}`, { align: 'right' });

    doc.end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to generate certificate' });
  }
});
// ✅ Mark a course as completed
router.post('/student/complete', async (req, res) => {
  const { courseId, studentEmail } = req.body;

  try {
    const enrollment = await Enrollment.findOne({ courseId, studentEmail });
    if (!enrollment) {
      return res.status(404).json({ error: 'Enrollment not found' });
    }

    enrollment.completed = true;
    enrollment.progress = 100;
    await enrollment.save();

    res.json({ message: 'Course marked as completed' });
  } catch (err) {
    console.error('Completion error:', err);
    res.status(500).json({ error: 'Failed to mark course as completed' });
  }
});

module.exports = router;
