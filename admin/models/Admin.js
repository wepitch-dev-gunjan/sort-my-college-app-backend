const { Schema, model } = require("mongoose");

const adminSchema = new Schema(
  {
    role: {
      type: String,
      default: "ADMIN",
      enum: ['SUPER_ADMIN', "ADMIN"]
    },
    password: {
      type: String,
    },
    email: {
      type: String,
    },
    permissions: {
      type: [String],
      enum: [
        "payment_read",
        "payment_write",
        "counsellor_read",
        "counsellor_write",
        "user_read",
        "user_write",
        "institute_read",
        "institute_write",
        "accommodation_read",
        "accommodation_write",
        "banners_read",
        "banners_write",
        "help_read",
        "help_write",
        "admin_read",
        "admin_write",
      ],
    },
    profile_pic: {
      type: String,
    },
  },
  {
    timestamps: true,
    strict: false,
  }
);

module.exports = model("Admin", adminSchema);
