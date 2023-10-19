const nodemailer = require("nodemailer");

exports.transporter = (req) => {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "smcapp.official@gmail.com",
      pass: "cqds sbpg neqe lakd",
    },
  });
};
