const { Schema, model } = require("mongoose");

const webinarSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  video: {
    type: String,
    required: true,
    unique,
  },
});

module.exports = model("Webinar", webinarSchema);
