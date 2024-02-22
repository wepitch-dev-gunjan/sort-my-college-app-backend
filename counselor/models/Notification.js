const { Schema, model } = require('mongoose');

const notificationSchema = new Schema({
  title: {
    type: String,
    default: '',
  },

  message: {
    type: String,
    default: ''
  },

  counsellor: {
    type: Schema.Types.ObjectId,
    ref: 'Counsellor'
  },

  read: {
    type: Boolean,
    default: false
  }
});

module.exports = model('Notification', notificationSchema);