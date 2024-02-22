const { Schema, model } = require("mongoose");

const documentTypeSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
  },
  {
    strict: false,
  }
);

module.exports = model("DocumentType", documentTypeSchema);
