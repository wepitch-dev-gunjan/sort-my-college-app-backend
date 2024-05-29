const { Schema, model } = require("mongoose");

const accommodationEnquirySchema = new Schema(
  {
    enquirer: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    preferred_time: [String],
    enquired_to: {
      type: Schema.Types.ObjectId,
      ref: "Accommodation",
    },
    enquiryStatus: {
      type: String,
      enum: ["Unseen", "Pending", "Sent"],
      default: "Unseen",
    },
  },
  {
    timestamps: true,
    strict: false,
  }
);

module.exports = model("Enquiry", accommodationEnquirySchema);
