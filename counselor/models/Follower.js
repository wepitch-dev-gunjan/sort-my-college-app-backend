const { Schema, model } = require('mongoose');

const followerSchema = new Schema({
  followed_to: {
    type: String
  },
  followed_by: {
    type: String,
  },
  followed: {
    type: Boolean,
    default: true
  },
  follower_profile_pic: {
    type: String,
    default: "https://cdn.iconscout.com/icon/free/png-256/free-avatar-370-456322.png?f=webp"
  },
  follower_name: {
    type: String,
    default: 'Anonymous'
  },
  follower_email: {
    type: String,
    default: 'anonymous@something.com'
  }
}, {
  timestamps: true
}, {
  strict: false
})

module.exports = model('Follower', followerSchema)