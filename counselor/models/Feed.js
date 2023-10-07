const { Schema, model } = require('mongoose');

const feedSchema = new Schema({
  feed_owner: {
    type: String,
    required: true,
  },
  feed_link: {
    type: String,
    required: true
  },
  feed_likes: [
    {
      type: String
    }
  ],
  feed_comments: [
    {
      type: Schema.Types.ObjectId,
      ref: "Comment"
    },
  ],
  feed_visibility: {
    type: Boolean,
    default: true,
  },

  feed_caption: {
    type: String,
  }
});

module.exports = model('Feed', feedSchema);