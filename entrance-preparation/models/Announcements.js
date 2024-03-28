const {Schema, model} = require('mongoose')

const announcementSchema = new Schema ({
    update : {
        type: String
    },
},
{
    timestamps: true,
    strict: false
})

exports.module = model('Announcements', announcementSchema)