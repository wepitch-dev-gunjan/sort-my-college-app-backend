const { Schema, model } = require("mongoose");

const webinarSchema = new Schema({
  webinar_host: {
    type: String,
    required: true,
  },
  webinar_attendees: [{
    type: String,
  }],
  webinar_registrations: [{
    type: String,
  }],
  webinar_title: {
    type: String,
    required: true,
  },
  webinar_thumbnail: {
    type: String,
  },
  webinar_details: {
    type: [String],
    default: ""
  },
  webinar_date: {
    type: Date,
  },
  webinar_time: {
    type: String,
  },
  webinar_fee: {
    type: Number,
    required: true,
    default: 0
  },
  webinar_slots: {
    type: Number,
  },
  webinar_available_slots: {
    type: Number,
    default: this.webinar_slots
  },
  webinar_link: {
    type: String,
  }
}, {
  timestamps: true,
}, {
  strict: false
});

module.exports = model("Webinar", webinarSchema);
