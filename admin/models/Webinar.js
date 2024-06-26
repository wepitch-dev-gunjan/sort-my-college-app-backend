const { Schema, model } = require('mongoose');

const webinarSchema = new Schema(
  {
    webinar_title: String,
    webinar_details: [String],
    what_will_you_learn: [String],
    webinar_date: Date,
    speaker_profile: String,
    webinar_by: String,
    webinar_image: String,
    webinar_start_url: String,
    webinar_join_url: String,
    webinar_password: String,
    webinar_total_slots: Number,
    registered_participants: [{ type: Object }],
    attended_participants: [{ type: Object }]
  },
  {
    timestamps: true,
    strict: false
  }
);

webinarSchema.virtual('webinar_available_slots').get(function () {
  return 500 - this.registered_participants.length;
});

module.exports = model('Webinar', webinarSchema);
