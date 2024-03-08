const {Schema , model} = require('mongoose');

const faculties = new Schema ({
    name :{
        type :String,
        required :true
    },
    profile_pic:{
        type:String,
    },
    qualification:{
        type:String,
        required:true
    },
});
module.exports = model('Faculties',faculties)