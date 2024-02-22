const { Schema, model } = require('mongoose');

const issueSchema = new Schema({
  category: {
    type: Schema.Types.ObjectId,
    ref: 'IssueCategory',
    // required: true,
  },
  status: {
    type: String,
    enum: ['ACTIVE', 'CLOSED'],
    default: 'ACTIVE'
  }
}, {
  timestamps: true,
  strict: false
});

module.exports = model('Issue', issueSchema);