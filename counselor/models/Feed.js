const { Schema, model } = require('mongoose');

const feedSchema = new Schema({
  feed_link: {
    type: String,
    required: true
  },
  feed_likes: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User'
    }
  ],
  feed_comments: [
    {
      type: Schema.Types.ObjectId,
      ref: "Comment"
    }
  ]
});

module.exports = model('Feed', feedSchema);