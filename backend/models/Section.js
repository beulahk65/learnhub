// models/Section.js
const mongoose = require('mongoose');

const sectionSchema = new mongoose.Schema({
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  title: { type: String, required: true },
  content: String,
  videoUrl: String
}, { timestamps: true });

module.exports = mongoose.model('Section', sectionSchema);
