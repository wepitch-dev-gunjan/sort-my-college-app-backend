const { Schema, model } = require('mongoose');

const enquirySchema = new Schema(
  {
    message: {
      type: String,
      required: true,
    },
    enquirer: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    enquired_to: {
      type: Schema.Types.ObjectId,
      ref: 'EntranceInstitute',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = model('Enquiry', enquirySchema);
