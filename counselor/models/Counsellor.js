const { Schema, model } = require("mongoose");

const counsellorSchema = new Schema(
  {
    name: {
      type: String,
    },

    email: {
      type: String,
      unique: true,
    },

    phone_no: {
      type: String,
      default: "",
    },

    profile_pic: {
      type: String,
      default: function () {
        return this.gender === "Male"
          ? "data:image/jpeg;base64,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" // Male default image
          : "data:image/jpeg;base64,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"; // Female default image
      },
    },
    cover_image: {
      type: String,
      default: function () {
        return this.gender === "Male"
          ? "data:image/jpeg;base64,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" // Male default cover image
          : "data:image/jpeg;base64,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"; // Female default cover image
      },
    },

    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
      default: "Male",
    },

    location: {
      pin_code: {
        type: String,
        default: "PIN CODE",
      },
      city: {
        type: String,
        default: "CITY",
      },
      state: {
        type: String,
        default: "STATE",
      },
      country: {
        type: String,
        default: "COUNTRY",
      },
    },

    nationality: {
      type: String,
      default: "Indian",
    },

    designation: {
      type: String,
    },

    qualifications: [
      {
        type: String,
      },
    ],

    date_of_birth: {
      type: Date,
      default: new Date(),
    },

    next_session_time: {
      type: Date,
      default: new Date(0),
    },

    languages_spoken: [
      {
        type: String,
        default: "English",
      },
    ],

    experience_in_years: {
      type: Number,
      default: 0,
    },

    total_appointed_sessions: {
      type: Number,
      default: 0,
    },

    reward_points: {
      type: Number,
      default: 0,
    },

    activity_points: {
      type: Number,
      default: 0,
    },

    client_testimonials: [
      {
        rating: Number,
        comment: String,
        user_id: String,
      },
    ],

    average_rating: {
      type: Number,
      default: 0,
    },

    sessions: [
      {
        type: Schema.Types.ObjectId,
        ref: "Session",
        default: null,
      },
    ],

    how_will_i_help: [
      {
        type: String,
        default: "",
      },
    ],

    followers: {
      type: Number,
      default: 0,
    },

    degree_focused: [
      {
        type: String,
        default: "PG",
        enum: ["UG", "PG"],
      },
    ],

    locations_focused: [
      {
        type: String,
        enum: ["INDIA", "ABROAD"],
        default: "INDIA",
      },
    ],

    courses_focused: [
      {
        type: String,
        default: "",
      },
    ],

    approach_of_counselling: {
      type: String,
      default: "Google Meet",
    },

    group_session_price: {
      type: Number,
      default: 0,
    },

    personal_session_price: {
      type: Number,
      default: 0,
    },

    verified: {
      type: Boolean,
      default: false,
    },

    last_checkin_date: {
      type: Date,
      default: new Date(),
    },
  },
  {
    timestamps: true,
  },
  {
    strict: false,
  }
);

counsellorSchema.pre('save', function (next) {
  const requiredFields = ['name', 'email', 'phone_no', 'profile_pic', 'cover_image', 'gender', 'location', 'nationality', 'designation', 'qualifications', 'date_of_birth', 'languages_spoken', 'experience_in_years', 'sessions', 'how_will_i_help', 'degree_focused', 'locations_focused', 'courses_focused', 'approach_of_counselling', 'verified'];
  const allFieldsFilled = requiredFields.every(field => this[field]);

  if (this.isNew && this.reward_points === 0 && allFieldsFilled) {
    this.reward_points += 5;
  }

  next();
});

module.exports = model("Counsellor", counsellorSchema);
