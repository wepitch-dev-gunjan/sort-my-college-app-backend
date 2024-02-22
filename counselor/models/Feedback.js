const { Schema, model } = require('mongoose');

const feedbackSchema = new Schema({
  feedback_to: {
    type: String
  },
  feedback_from: {
    type: String,
  },
  profile_pic: {
    type: String,
    default: "https://cdn.iconscout.com/icon/free/png-256/free-avatar-370-456322.png?f=webp"
  },
  user_name: {
    type: String,
    default: 'Anonymous'
  },
  rating: {
    type: Number,
    default: 0
  },
  message: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
}, {
  strict: false
})

module.exports = model('Feedback', feedbackSchema)