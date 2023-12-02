const { Schema, model } = require("mongoose");

const documentSchema = new Schema({
  document_type: {
    type: String,
    required: true,
    unique: true,
  },
  file: {
    type: String,
  },
});

module.exports = model("Document", documentSchema);
