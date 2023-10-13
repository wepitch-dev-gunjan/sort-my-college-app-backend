const { Schema, model } = require('mongoose');

const appointmentSchema = new Schema(
  {
    applicant: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    appointed_to: {
      type: Schema.Types.ObjectId,
      ref: 'EntranceInstitute',
      required: true,
    },
    appointment_date: {
      type: Date,
      required: true,
    },
    appointment_status: {
      type: String,
      enum: ['Appointed', 'Canceled', 'Pending'],
      default: 'Pending',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = model('Appointment', appointmentSchema);
