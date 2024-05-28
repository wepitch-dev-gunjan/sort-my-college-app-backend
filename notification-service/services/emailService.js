const nodemailer = require("nodemailer");

exports.transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "nikhilmandia2@gmail.com",
    pass: "cqds sbpg neqe lakd",
  },
});
