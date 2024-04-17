const { Schema } = require("mongoose");

const accommodationSchema = new Schema({
  name: {
    type: String,
  },
  address: {
    area: {
      type: String,
    },
    city: {
      type: String,
    },
    state: {
      type: String,
    },
  },
  images: {
    type: [],
    default: "default image url",
  },
  rating: {
    type: parseFloat.toFixed(1),
    default: 0,
  },
  reviews: {
    type: String,
    default: 0,
  },
  starting_from: {
    amount: { type: Number },
    currency: { type: String, default: "INR" },
    frequency: { type: String, default: "month" },
  },
  direction: {
    type: String,
  },
  rooms_offered: [
    {
      single_sharing: {
        amount: { type: Number },
      },
    },
    {
      double_sharing: {
        amount: { type: Number },
      },
    },
    {
      triple_sharing: {
        amount: { type: Number },
      },
    },
  ],
  accommodating_for: {
    type: [String],
    enum: ["Boys", "Girls"],
    default: "Boys",
  },
  near_by_locations: {
    colleges: [String],
    hospitals: [String],
    metro_stations: [String],
  },
  feedback: {
    type: String,
  },
});
module.exports = model("accommodation", accommodationSchema);
