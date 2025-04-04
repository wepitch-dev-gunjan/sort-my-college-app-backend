const { Schema, model } = require("mongoose");

// const userSchema = new Schema(
//   {
//     email: {
//       type: String,
//       unique: true,
//       sparse: true,
//     },
//     phone_number: {
//       type: String,
//       unique: true,
//       sparse: true,
//     },
//     name: {
//       type: String,
//     },
//     gender: {
//       type: String,
//       enum: ["Male", "Female", "Other"],
//     },
//     date_of_birth: {
//       type: String,
//     },
//     location: {
//       city: String,
//     },
//     profile_pic: {
//       type: String,
//       default: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
//     },
//     education_level: {
//       type: String,
//       enum: ["Student", "College", "Graduated"],
//       default: "Student",
//     },
//     verified: {
//       type: Boolean,
//       default: false,
//     },
//   },
//   {
//     timestamps: true,
//     strict: false,
//   }
// );


const userSchema = new Schema(
  {
    email: {
      type: String,
      unique: true,
      sparse: true,
    },
    phone_number: {
      type: String,
      unique: true,
      sparse: true,
    },
    name: {
      type: String,
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
    },
    date_of_birth: {
      type: String,
    },
    location: {
      city: String,
    },
    profile_pic: {
      type: String,
      default:
        "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
    },
    education_level: {
      type: String,
      enum: ["Student", "College", "Graduated"],
      default: "Student",
    },
    verified: {
      type: Boolean,
      default: false,
    },
    fcm_token: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
    strict: false,
  }
);




// Custom validation to check uniqueness for non-null values
userSchema.path("phone_number").validate(async function (value) {
  if (value !== null) {
    const count = await this.model("User").countDocuments({
      phone_number: value,
      _id: { $ne: this._id },
    });
    return !count;
  }
  return true;
}, "Phone number must be unique except for null values.");

userSchema.path("email").validate(async function (value) {
  if (value !== null) {
    const count = await this.model("User").countDocuments({
      email: value,
      _id: { $ne: this._id },
    });
    return !count;
  }
  return true;
}, "Email must be unique except for null values.");

module.exports = model("User", userSchema);
