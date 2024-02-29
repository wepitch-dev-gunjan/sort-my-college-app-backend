const { Schema, model } = require("mongoose");

const documentSchema = new Schema({
  document_type: {
    type: Schema.Types.ObjectId,
    ref: 'DocumentType',
    required: true,
  },
  user: {
    type: String,
    required: true,
  },
  file: {
    type: String,
  },
}, {
  strict: false,
  timestamps: true
});

module.exports = model("Document", documentSchema);
