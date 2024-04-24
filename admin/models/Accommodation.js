const { Schema } = require("mongoose");

const accommodationSchema = new Schema(
  {
    type: {
      type: String,
      default: "PG",
      enum: ["PG", "Hostel"],
    },

    images: [String],
    name: String,
    address: {
      area: String,
      city: String,
      state: String,
      pin_code: String,
    },
    direction: String,
    total_beds: Number,
    recommended_for: {
      type: String,
      enum: ["Boys", "Girls", "Both"],
      default: "Boys",
    },

    owner: {
      full_name: String,
      dob: Date,
      gender: {
        type: String,
        enum: ["Male", "Female", "Other"],
      },
      contact_numbers: [String],
      email: String,
      adhar_card: String,
      pan_card: String,
    },

    nearby_locations: {
      colleges: [String],
      hospitals: [String],
      metro_stations: [String],
    },

    rooms: [
      {
        sharing_type: {
          type: String,
          enum: ["Single", "Double", "Triple"],
        },
        available: {
          type: Boolean,
          default: true,
        },
        deposit_amount: Number,
        monthly_charge: Number,
        notice_period: String,
        details: [String],
      },
    ],

    rating: {
      type: parseFloat.toFixed(1),
      default: 0,
    },

    common_area_amenities: [String],
    house_rules: [String],
    gate_opning_time: String,
    gate_closing_time: String,
  },
  {
    timestamps: true,
    strict: false,
  }
);
module.exports = model("Accommodation", accommodationSchema);
