const { Schema, model } = require('mongoose');


const entranceInstituteSchema = new Schema({
  name: {
    type: String
  },
  email: {
    type: String,
    required: true,
    sparsed: true
  },
  profile_pic: {
    type: String,
  },
  banner_image: {
    type: String
  },
  about: {
    type: String
  },
  degree_focused: {
    type: String,
    default: 'PG',
    enum: ['UG', 'PG']
  },
  courses_offered: [
    {
      type: Schema.Types.ObjectId,
      ref: "EntranceCourse",
      default: null
    }
  ],
  country: {
    type: String
  },
  state: {
    type: String
  },
  city: {
    type: String
  },
  area: {
    type: String
  },
  working_time: {
    opening_time: {
      type: String,
    },
    closing_time: {
      type: String
    }
  },
  working_experience: {
    type: Number
  },
  user_feedbacks: [
    {
      type: Schema.Types.ObjectId,
      ref: "UserFeedbacks",
      default: null
    },
  ],
  emergency_contact: {
    type: Number,
  },
  mode_of_education: {
    type : String,
    enum :['Online' , 'Offline' ,'Hybrid']
  },
  languages: {
    type:String,
    enum: ['Hindi' , 'English']
  },
  mode_of_payment :[
    {
      type: String,
      required: true
    }
  ],
  faculties: [
    {
      type: Schema.Types.ObjectId,
      ref: "Faculties",
      default: null
    }
  ],
}, {
  timestamps: true
},
{
  strict: false
});

module.exports = model('EntranceInstitute', entranceInstituteSchema)