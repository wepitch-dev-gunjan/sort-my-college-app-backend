const {Schema, model} = require('mongoose')

const keyFeaturesAdminSchema = new Schema({
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

module.exports = model('KeyFeaturesAdmin', keyFeaturesAdminSchema);