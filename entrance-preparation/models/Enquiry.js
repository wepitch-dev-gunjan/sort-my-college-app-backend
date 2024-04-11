const { Schema, model } = require("mongoose");

const enquirySchema = new Schema(
  {
    enquirer: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    enquired_to: {
      type: Schema.Types.ObjectId,
      ref: "EntranceInstitute",
    },
    courses: [String],
    mode: [String],
    preferred_time: [String],
    message: {
      type: String,
    },
    status: {
      type: ["Seen", "Unseen", "Solved"],
      default: "Unseen",
    },
  },
  {
    timestamps: true,
    strict: false,
  }
);

module.exports = model("Enquiry", enquirySchema);
