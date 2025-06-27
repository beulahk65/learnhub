const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: String,
  description: String,
  teacherEmail: String,
  students: [String],
  isDeleted: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model('Course', courseSchema);
