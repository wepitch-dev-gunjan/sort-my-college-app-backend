const {Schema , model} = require('mongoose');

const facultySchema = new Schema ({
    name :{
        type :String,
    },
    display_pic:{
        type: String,
    },
    experience_in_years: {
        type: Number
    },
    qualifications:{
        type: String,
    },
    graduated_from: [String]
},
{
    strict: false,
    timestamps: true
  }
);

module.exports = model('Faculties',facultySchema)