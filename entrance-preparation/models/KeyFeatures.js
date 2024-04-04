const {Schema, model} = require('mongoose')

const keyFeatureSchema = new Schema ({
    institute: {
        type: Schema.Types.ObjectId,
        ref: "EntranceInstitute"
    },
    key_feature : String
},
{
    strict: false,
    timestamps: true
}
);

module.exports = model('KeyFeatures', keyFeatureSchema)