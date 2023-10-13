const { Schema, model } = require('mongoose');

const entranceCourseSchema = new Schema({
  course_name: {
    type: String
  },
  course_degree: {
    type: String
  },
  online: {
    type: Boolean
  },
  offline: {
    type: Boolean
  }
});

module.exports = model('EntranceCourse', entranceCourseSchema);