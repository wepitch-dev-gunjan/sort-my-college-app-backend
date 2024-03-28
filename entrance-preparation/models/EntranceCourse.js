const { Schema, model } = require("mongoose");

const entranceCourseSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['UG', 'PG'],
  },
  academic_session: {
    start_year: Date,
    end_year: Date
  },
  course_fee: {
    type: Number
  },
  course_duration_in_days: {
    type: Number
  },
},
{
  strict: false,
  timestamps: true
}
);

module.exports = model("EntranceCourse", entranceCourseSchema);
