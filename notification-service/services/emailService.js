const nodemailer = require("nodemailer");

exports.transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "support@sortmycollege.com",
    pass: "ovqj iqhk cspp ousy",
  },
});
