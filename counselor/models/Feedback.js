const { Schema, model } = require('mongoose');

const feedbackSchema = new Schema({
  feedback_giver: {
    type: Object,
    default: {}
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