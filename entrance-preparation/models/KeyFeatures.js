const {Schema, model} = require('mongoose')

const keyFeatureSchema = new Schema ({
    institute: {
        type: Schema.Types.ObjectId,
        ref: "EntranceInstitute"
    },
    name: {
        type: String
    },
    key_features_icon: {
        type: String
    }
},
{
    strict: false,
    timestamps: true
}
);

module.exports = model('KeyFeatures', keyFeatureSchema)