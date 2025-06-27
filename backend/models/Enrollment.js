// ✅ models/Enrollment.js (REPLACE COMPLETELY)
const mongoose = require('mongoose');

const enrollmentSchema = new mongoose.Schema({
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  studentEmail: {
    type: String,
    required: true
  },
  progress: {
    type: Number,
    default: 0
  },
  completed: {
    type: Boolean,
    default: false
  },
  completedSections: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Section'
  }]
}, { timestamps: true });

module.exports = mongoose.model('Enrollment', enrollmentSchema);
