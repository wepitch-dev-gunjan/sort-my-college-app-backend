const { Schema, model } = require("mongoose");

const reviewSchema = new Schema(
  {
    user: {
      id: {
        type: Schema.Types.ObjectId,
      },
      name: {
        type: String,
        required: true,
      },
      profile_pic: {
        type: String,
        required: true,
      },
    },
    rating: {
      type: Number,
      required: true,
    },
    comment: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = model("Review", reviewSchema);
