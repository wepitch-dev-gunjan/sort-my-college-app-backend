const { Schema, model } = require('mongoose');

const questionSchema = new Schema({
  issue: {
    type: Schema.Types.ObjectId,
    ref: 'Issue',
    required: true
  },
  answer_of: {
    type: Schema.Types.ObjectId,
    ref: 'Answer'
  },
  enquirer: {
    type: String,
    required: true
  },
  content: String,
},
  {
    timestamps: true,
    strict: false
  });

module.exports = model('Question', questionSchema)