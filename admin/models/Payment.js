const { Schema, model } = require("mongoose");

const paymentSchema = new Schema(
  {
    payment_to: { type: "string" },
    payment_from: { type: "string" },
    order_id: { type: String, required: true },
    payment_id: { type: String, required: true },
    amount: { type: Number, required: true },
    amount_due: { type: Number, required: true },
    amount_paid: { type: Number, required: true },
    currency: { type: String, required: true },
    created_at: { type: Date, required: true },
    entity: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone_no: { type: String, required: true },
    description: { type: String, required: true },
    status: {
      type: String,
      required: true,
    },
    paid: { type: Boolean, default: false, required: true },
    gst: { type: Number },
    convenience_charges: { type: Number },
  },
  {
    timestamps: true,
    strict: false,
  }
);

module.exports = model("Payment", paymentSchema);
