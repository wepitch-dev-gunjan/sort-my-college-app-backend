const {Schema, model} = require('mongoose')

const keyFeatureSchema = new Schema ({
    name: {
        type: String
    },
    icon: {
        type: String
    }
},
{
    strict: false,
    timestamps: true
}
);

module.exports = model('KeyFeatures', keyFeatureSchema)