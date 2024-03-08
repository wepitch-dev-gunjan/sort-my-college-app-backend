const { Schema, model } = require("mongoose");

const documentTypeSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    strict: false,
  }
);

module.exports = model("DocumentType", documentTypeSchema);
