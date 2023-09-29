const { Schema, model } = require('mongoose');

const counsellorSchema = new Schema({
  email: {
    type: String,
  },
  phone_no: {
    type: Number,
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
  next_appointment: Date,
  work_experience: Number,
  total_appointed_sessions: Number,
  reward_points: Number,
  client_testimonials: [
    {
      rating: Number,
      comment: String,
      user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
      }
    },
  ],
  total_ratings: Number,
  average_rating: Number,
  sessions: [
    {
      type: Schema.Types.ObjectId,
      ref: 'CounselingSession'
    }
  ],
  feeds: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Feed'
    }
  ],
  emergency_contact: {
    type: Number,
  },
}, {
  timestamps: true
});

module.exports = model('Counsellor', counsellorSchema);