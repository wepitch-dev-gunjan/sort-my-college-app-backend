const express = require("express");
const { google } = require("googleapis");
const {
  FRONTEND_URL,
  OAUTH2_CLIENT_ID,
  OAUTH2_CLIENT_SECRET,
  OAUTH2_REDIRECT_URI,
} = process.env;
const { generateToken } = require("../helpers/instituteHelpers");
const EntranceInstitute = require("../models/EntranceInstitute");

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
      prompt: "consent",
      scope: [
        "https://www.googleapis.com/auth/userinfo.profile",
        "https://www.googleapis.com/auth/userinfo.email",
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

    const { data } = await google
      .oauth2("v2")
      .userinfo.get({ auth: oauth2Client });
    let { email, name, picture } = data;

    // Save user information to the database if not already exists
    let institute = await EntranceInstitute.findOne({ email });
    if (!institute) {
      institute = new EntranceInstitute({
        email,
        name,
        profile_pic: picture,
      });
      await institute.save();
    }

    const token = generateToken(
      {
        institute_id: institute._id,
        email: institute.email,
        name: institute.name,
        picture: institute.profile_pic,
        tokens,
      },
      "7d"
    );

    const user = {
      _id: institute._id,
      email: institute.email,
      name: institute.name,
      // profile_pic: counsellor.profile_pic
    };

    const redirectURL = `${FRONTEND_URL}/?token=${token}&&user=${JSON.stringify(
      user
    )}`;

    console.log(redirectURL);
    res.redirect(redirectURL);
  } catch (error) {
    console.error(error);
    res.redirect(`${FRONTEND_URL}/login`);
  }
});

module.exports = router;
