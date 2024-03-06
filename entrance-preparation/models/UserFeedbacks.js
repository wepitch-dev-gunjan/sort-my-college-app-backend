const { Schema, model } = require('mongoose');

const userFeedbacksSchema = new Schema ({
    user_id: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    comment: {
        type: String,
        reuired: true
    }
},
{
    timestamps: true,
},
{
    strict: false
  });

module.exports = model('UserFeedbacks', userFeedbacksSchema)