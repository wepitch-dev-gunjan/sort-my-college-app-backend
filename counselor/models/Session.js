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
    session_price: {
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

sessionSchema.pre('save', async function (next) {
  const session = this;

  // Find minimum price for group sessions of this counsellor
  const minGroupSessionPrice = await mongoose.models.Session
    .findOne({ session_counsellor: session.session_counsellor, session_type: 'Group' })
    .sort('session_price')
    .limit(1)
    .select('session_price');

  // Find minimum price for personal sessions of this counsellor
  const minPersonalSessionPrice = await mongoose.models.Session
    .findOne({ session_counsellor: session.session_counsellor, session_type: 'Personal' })
    .sort('session_price')
    .limit(1)
    .select('session_price');

  // Update counsellor's groupSessionPrice if a minimum price exists
  if (minGroupSessionPrice) {
    session.counsellor.groupSessionPrice = minGroupSessionPrice.price;
  }

  // Update counsellor's personalSessionPrice if a minimum price exists
  if (minPersonalSessionPrice) {
    session.counsellor.personalSessionPrice = minPersonalSessionPrice.price;
  }

  next();
});

module.exports = model('Session', sessionSchema);
