const nodemailer = require("nodemailer");

exports.transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "naman@wepitch.uk",
    pass: "sdkp rtck abxv bams",
  },
});
