const { Schema, model } = require("mongoose");

const vocationalCourseSchema = new Schema({
  course_owner_name: {
    type: String,
  },
  course_owner_email: {
    type: String,
    required: true,
  },
  course_name: {
    type: String,
    required: true,
  },
  course_category: {
    type: String,
    required: true,
    unique: true,
  },
  course_image: {
    type: String,
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
