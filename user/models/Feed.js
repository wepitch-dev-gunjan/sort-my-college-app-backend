const { Schema, model } = require('mongoose');

const feedSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User', // Reference to the user who posted the feed
    required: true,
  },
  caption: String,
  mediaType: {
    type: String,
    enum: ['image', 'video', 'other'], // Enum to specify the type of media
    required: true,
  },
  mediaUrl: {
    type: String,
    required: true,
  },
  likes: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User', // Reference to users who liked the feed
    },
  ],
  comments: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: 'User', // Reference to the user who commented
      },
      text: String,
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
}, {
  timestamps: true,
});

module.exports = model('Feed', feedSchema);
