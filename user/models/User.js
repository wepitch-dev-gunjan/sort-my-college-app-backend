const { Schema, model } = require('mongoose');

const userSchema = new Schema({
  email: String,
  personal_info: {
    name: {
      type: String,
      required: true,
    },
    contact_number: String,
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
    profile_pic: {
      type: String,
    }
  },
  saved_counsellors: [
    {
      type: String
    },
  ],
  saved_vocational_courses: [
    {
      type: String
    },
  ],
  saved_entrance_preparations: [
    {
      type: String
    },
  ],
  saved_feeds: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Feed'
    }
  ],
}, {
  timestamps: true
});

module.exports = model('User', userSchema);
