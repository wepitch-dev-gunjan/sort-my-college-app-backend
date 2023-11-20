const express = require('express');
const { google } = require('googleapis');
const { FRONTEND_URL, OAUTH2_CLIENT_ID, OAUTH2_CLIENT_SECRET, OAUTH2_REDIRECT_URI } = process.env;
const { generateToken } = require('../helpers/counsellorHelpers');
const Counsellor = require('../models/Counsellor');

const router = express.Router();

// Initialize the Google OAuth2 client (You can move this to your main app file if needed)
const oauth2Client = new google.auth.OAuth2(OAUTH2_CLIENT_ID, OAUTH2_CLIENT_SECRET, OAUTH2_REDIRECT_URI);

// Route for initiating Google OAuth2 authentication
router.get('/auth/google', (req, res) => {
  const url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: [
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/calendar'
    ],
  });

  res.redirect(url);
});

// Route to handle the Google OAuth2 callback
router.get('/auth/google/callback', async (req, res) => {
  console.log('code');
  const { code } = req.query;
  try {
    // Assuming you have previously set up oauth2Client
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);
    console.log(tokens);

    const counsellorInfo = await google.oauth2('v2').userinfo.get({ auth: oauth2Client });
    const { email, name, picture } = counsellorInfo.data;

    // Save user information to the database if not already exists
    let counsellor = await Counsellor.findOne({ email });
    if (!counsellor) {
      counsellor = new Counsellor({
        email,
        name,
        profile_pic: picture,
      });
      await counsellor.save();
    }

    const _id = counsellor._id;

    const token = generateToken({ email, name, picture, tokens }, '7d');
    // Redirect to homepage or dashboard
    res.cookie('token', token, { maxAge: 7 * 24 * 60 * 60 * 1000 });
    res.cookie('user', { _id, email, name, profile_pic: counsellor.profile_pic }, { maxAge: 7 * 24 * 60 * 60 * 1000 })
    res.redirect(`${FRONTEND_URL}/`);
  } catch (error) {
    console.error(error);
    res.redirect(`${FRONTEND_URL}/login`);
  }
});

module.exports = router;
