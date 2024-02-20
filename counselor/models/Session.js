const { Schema, model, mongoose } = require("mongoose");

const sessionSchema = new Schema(
  {
    session_counsellor: {
      type: String,
    },
    session_user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    session_date: {
      type: Date,
    },
    session_massaged_date: {
      type: String,
    },
    session_time: {
      type: Number,
    },
    session_duration: {
      type: Number,
      default: 60,
    },
    session_type: {
      type: String,
      enum: ["Personal", "Group"],
    },
    session_fee: {
      type: Number,
      required: true,
      default: 0,
    },
    session_status: {
      type: String,
      enum: [
        "Cancelled",
        "Attended",
        "NotAttended",
        "Rescheduled",
        "Booked",
        "Available",
      ],
      default: "Available",
    },
    session_query: {
      type: String,
    },
    session_slots: {
      type: Number,
      required: true,
    },
    session_available_slots: {
      type: Number,
      default: this.session_slots,
    },
    session_link: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
  {
    strict: false,
  }
);

sessionSchema.pre("save", async function (next) {
  const session = this;

  // Find minimum price for group sessions of this counsellor
  const minGroupSessionPrice = await mongoose.models.Session.findOne({
    session_counsellor: session.session_counsellor,
    session_type: "Group",
  })
    .sort("session_price")
    .limit(1)
    .select("session_price");

  // Find minimum price for personal sessions of this counsellor
  const minPersonalSessionPrice = await mongoose.models.Session.findOne({
    session_counsellor: session.session_counsellor,
    session_type: "Personal",
  })
    .sort("session_price")
    .limit(1)
    .select("session_price");

  // Update counsellor's groupSessionPrice if a minimum price exists
  if (minGroupSessionPrice) {
    session.session_price = minGroupSessionPrice.session_price;
  }

  // Update counsellor's personalSessionPrice if a minimum price exists
  if (minPersonalSessionPrice) {
    session.session_price = minPersonalSessionPrice.session_price;
  }

  if (session.isNew) {
    // Set session_available_slots to session_slots value if it's not already defined
    if (!session.session_available_slots) {
      session.session_available_slots = session.session_slots;
    }
  }
  next();
});

module.exports = model("Session", sessionSchema);
