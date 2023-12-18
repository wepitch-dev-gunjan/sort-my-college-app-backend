const { Schema, model } = require("mongoose");

const webinarSchema = new Schema({
  webinar_host: {
    type: String,
    required: true,
  },
  webinar_title: {
    type: String,
    required: true,
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
  webinar_duration: {
    type: Number,
    default: 60
  },
  webinar_fee: {
    type: Number,
    required: true,
    default: 0
  },
  webinar_status: {
    type: String,
    enum: ['Cancelled', 'Attended', 'NotAttended', 'Rescheduled', 'Booked', 'Available'],
    default: 'Available',
  },
  webinar_slots: {
    type: Number,
    required: true
  },
  webinar_available_slots: {
    type: Number,
    default: this.webinar_slots
  },
  webinar_link: {
    type: String,
    required: true,
    unique: true,
  }
}, {
  timestamps: true,
}, {
  strict: false
});

module.exports = model("Webinar", webinarSchema);
