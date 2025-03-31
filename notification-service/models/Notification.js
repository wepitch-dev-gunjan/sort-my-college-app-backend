const { Schema, model } = require('mongoose');

const notificationSchema = new Schema({
  user_id: {
    type: String
  },
  title: {
    type: String,
  },
  message: {
    type: String,
  },
  image: {  // Image URL field (optional)
    type: String,
    default: null
  },
  read: {
    type: Boolean,
    default: false
  },
  recipientType: {
    type: String,
  },
  userReadStatus: {
    type: [String],
    default: []
  }

}, {
  timestamps: true,
  strict: false
});

module.exports = model('Notification', notificationSchema);


// const notificationSchema = new Schema({
//   user_id: {
//     type: String
//   },
//   title: {
//     type: String,
//   },
//   message: {
//     type: String,
//   },
//   read: {
//     type: Boolean,
//     default: false
//   }
// }, {
//   timestamps: true,
// }, {
//   strict: false
// })

// module.exports = model('Notification', notificationSchema);