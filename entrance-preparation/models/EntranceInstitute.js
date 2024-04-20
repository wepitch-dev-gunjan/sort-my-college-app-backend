const { Schema, model } = require('mongoose');


const entranceInstituteSchema = new Schema({
  registrant_full_name: {
    type: String
  },
  registrant_contact_number: {
    type: String
  },
  registrant_email: {
    type: String
  },
  registrant_designation: {
    type: String
  },
  profile_pic: {
    type: String,
  },
  cover_image: {
    type: String
  },
  name: {
    type: String
  },
  about: [{
    type: String
  }],
  address: {
    building_number: {
      type: String,
      default: "BULDING NUMBER",
    },
    area: {
      type: String,
      default: "AREA",
    },

    city: {
      type: String,
      default: "CITY",
    },
    state: {
      type: String,
      default: "STATE",
    },
    pin_code: {
      type: String,
      default: "PIN CODE",
    }
  },
  direction_url: {
    type: String
  },
  year_established_in: {
    type: Date
  },
  affilations: {
    type: String
  },
  email: {
    type: String,
  },
  contact_number: {
    type: String,
  },
  gstin: {
    type: String,
  },
  timings: [Object],
  mode_of_study: {
    type: [String],
    enum: ['ONLINE', 'OFFLINE']
  },
  medium_of_study: [String],
  followers: [String],
  status: {
    type: String,
    enum: ["APPROVED", "REJECTED", "PENDING"],
    default: "PENDING"
  },
  institute_key_features: [String],
},
  {
    timestamps: true
  },
  {
    strict: false
  });

module.exports = model('EntranceInstitute', entranceInstituteSchema)