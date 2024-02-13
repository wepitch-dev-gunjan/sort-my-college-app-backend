const { Schema, model } = require('mongoose');

const answerSchema = new Schema({
  issue: {
    type: Schema.Types.ObjectId,
    ref: 'Issue',
    required: true
  },
  question_of: {
    type: Schema.Types.ObjectId,
    ref: 'Question'
  },
  respondent: {
    type: String,
    required: true
  },
  content: String,
},
  {
    timestamps: true,
    strict: false
  });

module.exports = model('Answer', answerSchema)