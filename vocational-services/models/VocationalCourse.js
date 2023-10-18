const { Schema, model } = require("mongoose");

const vocationalCourseSchema = new Schema({
  course_name: {
    type: String,
    required: true,
  },
  course_category: {
    type: String,
    required: true,
    unique,
  },
  online: {
    type: Boolean,
    default: false,
  },
  offline: {
    type: Boolean,
    default: true,
  },
  city: {
    type: String,
    required: true,
  },
});

module.exports = model("VocationalCourse", vocationalCourseSchema);
