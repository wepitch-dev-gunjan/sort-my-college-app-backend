const express = require("express");
const { google } = require("googleapis");
const {
  FRONTEND_URL,
  OAUTH2_CLIENT_ID,
  OAUTH2_CLIENT_SECRET,
  OAUTH2_REDIRECT_URI,
} = process.env;
const { generateToken } = require("../helpers/adminHelpers");
const Admin = require("../models/Admin");

const router = express.Router();

// Initialize the Google OAuth2 client (You can move this to your main app file if needed)
const oauth2Client = new google.auth.OAuth2(
  OAUTH2_CLIENT_ID,
  OAUTH2_CLIENT_SECRET,
  OAUTH2_REDIRECT_URI
);

// Route for initiating Google OAuth2 authentication
router.get("/auth/google", (req, res) => {
  const url = oauth2Client.generateAuthUrl(
    {
      access_type: "offline",
      scope: [
        "https://www.googleapis.com/auth/userinfo.profile",
        "https://www.googleapis.com/auth/userinfo.email",
        "https://www.googleapis.com/auth/calendar",
      ],
    },
    "7d"
  );

  res.redirect(url);
});

// Route to handle the Google OAuth2 callback
router.get("/auth/google/callback", async (req, res) => {
  const { code } = req.query;
  try {
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    const adminInfo = await google
      .oauth2("v2")
      .userinfo.get({ auth: oauth2Client });
    let { email, name, picture } = adminInfo.data;

    // Save user information to the database if not already exists
    let admin = await Admin.findOne({ email });
    if (!admin) {
      admin = new Admin({
        email,
        name,
        profile_pic: picture,
      });
      await admin.save();
    }

    const token = generateToken(
      {
        admin_id: admin._id,
        email: admin.email,
        name: admin.name,
        picture: admin.profile_pic,
        tokens,
      },
      "7d"
    );

    const user = {
      _id: admin._id,
      email: admin.email,
      name: admin.name,
      profile_pic: admin.profile_pic,
    };

    const redirectURL = `${FRONTEND_URL}/?token=${token}&&admin=${JSON.stringify(
      user
    )}`;

    res.redirect(redirectURL);
  } catch (error) {
    console.error(error);
    res.redirect(`${FRONTEND_URL}/login`);
  }
});

module.exports = router;
