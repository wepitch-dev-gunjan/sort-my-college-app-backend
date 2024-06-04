const { Schema, model } = require('mongoose');

const bookingSchema = new Schema({
  booked_entity: {
    type: Object,
    default: {}
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  booking_type: {
    type: String,
    enum: ['Counsellor', 'EP', 'Webinar']
  },
  booking_data: {
    type: Object,
    default: {}
  }
}, {
  timestamps: true
}, {
  strict: false
})


module.exports = model('Booking', bookingSchema);