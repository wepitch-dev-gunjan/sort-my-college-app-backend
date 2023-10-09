const nodemailer = require("nodemailer");

exports.transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "smcapp.official@gmail.com",
    pass: "cqds sbpg neqe lakd",
  },
});
