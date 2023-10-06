const { Schema, model } = require('mongoose');

const commentSchema = new Schema({
  comment_text: {
    type: String,
    required: true
  },
  feed_id: {
    type: Schema.Types.ObjectId,
    ref: 'Feed'
  },
  comment_visibility: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = model('Comment', commentSchema);