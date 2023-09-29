const { Schema, model } = require('mongoose');

const userSchema = new Schema({
  personal_info: {
    name: {
      type: String,
      required: true,
    },
    contact_number: String,
    email: String,
    gender: {
      type: String,
      enum: ['Male', 'Female', 'Other'],
    },
    date_of_birth: {
      type: String
    },
    location: {
      city: String
    },
  },
  my_counselling_sessions: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Counselling'
    },
  ],
  my_vocational_courses: [
    {
      type: Schema.Types.ObjectId,
      ref: 'EntrancePreparation'
    },
  ],
  my_entrance_preparations: [
    {
      type: Schema.Types.ObjectId,
      ref: 'VocationalCourse'
    },
  ],
}, {
  timestamps: true
});

module.exports = model('User', userSchema);
