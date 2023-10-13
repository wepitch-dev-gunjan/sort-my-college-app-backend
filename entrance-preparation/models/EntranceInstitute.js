const { Schema, model } = require('mongoose');

const entranceInstituteSchema = new Schema({
  name: {
    type: String
  },
  email: {
    type: String,
    required: true,
    sparsed: true
  },
  profile_pic: {
    type: String,
  },
  degree_focused: {
    type: String,
    default: 'PG',
    enum: ['UG', 'PG']
  },
  country: {
    type: String
  },
  state: {
    type: String
  },
  city: {
    type: String
  },
  area: {
    type: String
  },
  working_time: {
    opening_time: {
      type: String,
    },
    closing_time: {
      type: String
    }
  },
  working_experience: {
    type: Number
  },
  client_testimonials: [
    {
      rating: Number,
      comment: String,
      user_id: String,
    },
  ],
  emergency_contact: {
    type: Number,
  },
}, {
  timestamps: true
});

module.exports = model('EntranceInstitute', entranceInstituteSchema)