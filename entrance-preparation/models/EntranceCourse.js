const { Schema, model } = require("mongoose");

const entranceCourseSchema = new Schema({
  course_name: {
    type: String,
    unique: true,
  },
  course_degree: {
    type: String,
    enum: ["UG", "PG"],
  },
  online: {
    type: Boolean,
    default: false,
  },
  offline: {
    type: Boolean,
    default: true,
  },
});

module.exports = model("EntranceCourse", entranceCourseSchema);
