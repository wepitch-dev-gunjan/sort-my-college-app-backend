const { Schema, model } = require("mongoose");

const entranceCourseSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['UG', 'PG'],
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  duration: {
    type: Number,
    required: true
  },
  mode: {
    type: String,
    enum: ['Online', 'Offline', 'Hybrid']
  }
});

module.exports = model("EntranceCourse", entranceCourseSchema);
