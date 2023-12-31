const { Schema, model } = require('mongoose');

const sessionSchema = new Schema(
  {
    session_counselor: {
      type: Schema.Types.ObjectId,
      ref: 'Counsellor',
    },
    session_user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    session_date: {
      type: Date,
    },
    session_time: {
      type: Number,
    },
    session_duration: {
      type: Number,
      default: 60
    },
    session_type: {
      type: String,
      enum: ['Personal', 'Group']
    },
    session_fee: {
      type: Number,
      required: true,
      default: 0
    },
    session_status: {
      type: String,
      enum: ['Cancelled', 'Attended', 'NotAttended', 'Rescheduled', 'Booked', 'Available'],
      default: 'Available',
    },
    session_query: {
      type: String
    },
    session_slots: {
      type: Number,
      required: true
    },
    session_available_slots: {
      type: Number,
      default: this.session_slots,
      // required: true,
    },
    session_link: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true,
  }
);

module.exports = model('Session', sessionSchema);
