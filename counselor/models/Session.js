const { Schema, model } = require('mongoose');

const counselingSessionSchema = new Schema(
  {
    session_counselor: {
      type: Schema.Types.ObjectId,
      ref: 'Counselor',
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
    },
    session_status: {
      type: String,
      enum: ['Cancelled', 'Attended', 'NotAttended', 'Rescheduled', 'Booked', 'Available'],
      default: 'Available',
    },
    session_query: {
      type: String
    }
  },
  {
    timestamps: true,
  }
);

module.exports = model('CounselingSession', counselingSessionSchema);
