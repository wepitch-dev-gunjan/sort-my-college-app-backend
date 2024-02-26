const { Schema, model } = require("mongoose");

const bankDetailsSchema = new Schema({
  recepient_name: {
    type: String,
  },

  bank_name: {
    type: String,
  },

  branch: {
    Type: String,
  },

  account_type: {
    type: String,
    enum: ["Savings", "Current"],
  },

  account_number: {
    type: Number,
  },

  ifsc_code: {
    type: String,
  },
});

module.exports = model("BankDetails", bankDetailsSchema);
