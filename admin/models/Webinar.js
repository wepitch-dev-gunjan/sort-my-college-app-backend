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
    registered_participants: [{ type: String }],
    attended_participants: [{ type: String }],
  },
  {
    timestamps: true,
    strict: false,
  }
);

webinarSchema.virtual('webinar_available_slots').get(function () {
  return 500 - this.registered_participants.length;
});

module.exports = model('Webinar', webinarSchema);
