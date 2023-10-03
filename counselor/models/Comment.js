const { Schema, model } = require('mongoose');

const commentSchema = new Schema({
  comment_text: {
    type: String,
    required: true
  },
  comment_replies: [
    {
      type: Schema.Types.Object
    }
  ]
});

module.exports = model('Comment', commentSchema);