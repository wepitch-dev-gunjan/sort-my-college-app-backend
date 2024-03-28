const { Schema, model } = require('mongoose');


const entranceInstituteSchema = new Schema({
  registrant_full_name: {
    type: String
  },
  registrant_contact_number: {
    type: String
  },
  registrant_email : {
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
  address : {
    building_number: String,
    area: String,
    city: String,
    state : String,
    pin_code: String
  },
  direction_url : {
    type : String
  },
  year_established_in : {
    type : Date
  },
  affilations: {
    type: String
  },
  email: {
    type: String,
  },
  contact_number : {
    type: String,
  },
  gstin: {
    type: String,
  },
  institute_timings:{
    day: {
      type: [String], 
      enum: ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY']
    },
    time: {
      start_time: Date,
      end_time: Date
    }
  },
  mode_of_study: {
    type: [String], 
    enum: ['ONLINE', 'OFFLINE'] 
  },
  medium_of_study : [String],
}, 
{
  timestamps: true
},
{
  strict: false
});

module.exports = model('EntranceInstitute', entranceInstituteSchema)