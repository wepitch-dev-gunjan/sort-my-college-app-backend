const { Schema, model } = require('mongoose');

const courseSchema = new Schema({
  course_name: {
    type: String,
    required: true,
    unique: true,
  },
  course_counsellors: [
    {
      type: Schema.Types.ObjectId
    }
  ]
});

module.exports = model('Course', courseSchema);