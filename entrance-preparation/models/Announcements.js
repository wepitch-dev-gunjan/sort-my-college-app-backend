const {Schema, model} = require('mongoose')

const announcementSchema = new Schema ({
    update : {
        type: String
    },
    institute: {
        type: Schema.Types.ObjectId,
        ref: "EntranceInstitute"
      }
},
{
    timestamps: true,
    strict: false
})

exports.module = model('Announcements', announcementSchema)