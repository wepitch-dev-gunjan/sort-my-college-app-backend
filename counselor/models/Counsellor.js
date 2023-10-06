const { Schema, model } = require('mongoose');

const counsellorSchema = new Schema({
  email: {
    type: String,
  },

  phone_no: {
    type: String,
  },

  personal_info: {
    name: {
      type: String,
    },
    profile_pic: String,
    gender: {
      type: String,
      enum: ['Male', 'Female', 'Other']
    },
    location: {
      city: String,
      state: String,
      country: String
    }
  },

  qualifications: [
    {
      type: String,
    }
  ],

  specializations: [
    {
      type: String,
    }
  ],

  languages_spoken: [
    {
      type: String,
    }
  ],

  client_focus: [
    {
      type: String,
    }
  ],

  work_experience: Number,

  total_appointed_sessions: Number,

  reward_points: Number,

  client_testimonials: [
    {
      rating: Number,
      comment: String,
      user_id: String,
    },
  ],

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

  emergency_contact: {
    type: Number,
  },

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
    type: Schema.Types.ObjectId,
    ref: 'Course'
  }],

}, {
  timestamps: true
});

module.exports = model('Counsellor', counsellorSchema);