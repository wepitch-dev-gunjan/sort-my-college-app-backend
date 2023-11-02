const { Schema, model } = require('mongoose');

const counsellorSchema = new Schema({
  name: {
    type: String,
  },

  email: {
    type: String,
  },

  phone_no: {
    type: String,
  },

  profile_pic: {
    type: String,
  },

  cover_image: {
    type: String,
  },

  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other']
  },

  location: {
    pin_code: Number,
    city: String,
    state: String,
    country: String
  },

  designation: {
    type: String,
  },

  qualifications: [
    {
      type: String,
    }
  ],

  next_session_time: {
    type: Date,
    default: new Date()
  },

  languages_spoken: [
    {
      type: String,
    }
  ],

  experience_in_years: Number,

  total_appointed_sessions: Number,

  reward_points: Number,

  client_testimonials: [
    {
      rating: Number,
      comment: String,
      user_id: String,
    },
  ],

  average_rating: Number,

  sessions: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Session'
    }
  ],

  how_will_i_help: [
    {
      type: String,
    }
  ],

  followers: [
    {
      type: String,
    }
  ],

  degree_focused: {
    type: String,
    default: 'PG',
    enum: ['UG', 'PG']
  },

  locations_focused: [{
    type: String,
    enum: ['INDIA', 'ABROAD']
  }],

  courses_focused: [{
    type: String
  }],

}, {
  timestamps: true
});

module.exports = model('Counsellor', counsellorSchema);