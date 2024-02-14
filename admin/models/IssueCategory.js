const { Schema, model } = require('mongoose');

const issueCategorySchema = new Schema({
  name: String
})

module.exports = model('IssueCategory', issueCategorySchema);