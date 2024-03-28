const {Schema, model} = require('mongoose')

const keyFeatureSchema = new Schema ({
    name: {
        type: String
    },
    icon: {
        type: String
    },
    institute: {
        type: Schema.Types.ObjectId,
        ref: "EntranceInstitute"
      }
},
{
    strict: false,
    timestamps: true
}
);

module.exports = model('KeyFeatures', keyFeatureSchema)