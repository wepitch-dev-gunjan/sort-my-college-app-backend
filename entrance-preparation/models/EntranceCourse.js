const { Schema, model } = require("mongoose");

const entranceCourseSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  image: {
   type : String
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
  institute: {
    type: Schema.Types.ObjectId,
    ref: "EntranceInstitute"
  }
},
{
  strict: false,
  timestamps: true
}
);

module.exports = model("EntranceCourse", entranceCourseSchema);
