const { Schema, model } = require("mongoose");

const webinarSchema = new Schema({
  webinar_name: {
    type: String,
    required: true,
  },
  webinar_owner_name: {
    type: String,
    required: true,
  },
  webinar_email: {
    type: String,
    required: true
  },
  webinar_link: {
    type: String,
    required: true,
    unique: true,
  },
});

module.exports = model("Webinar", webinarSchema);
