const moment = require("moment/moment");
const KJUR = require('jsrsasign');
require('dotenv').config();

// Your Zoom app credentials from the App Marketplace
const clientId = process.env.ZOOM_OAUTH_CLIENT_ID;
const clientSecret = process.env.ZOOM_OAUTH_CLIENT_SECRET;
const accountId = process.env.ZOOM_OAUTH_ACCOUNT_ID;

const isCounsellingSessionAvailable = async (sessionId) => {
  const session = await CounsellingSession.findOne({
    _id: sessionId,
    status: 'Available',
  });
  return session ? true : false;
};

exports.sessionTimeIntoMinutes = (time) => {
  const sessionTime = time;

  // Split the session time into hours and minutes
  const [hours, minutes] = sessionTime.split(":").map(Number);

  // Calculate the total minutes from the start of the day (midnight)
  return hours * 60 + minutes;
}

exports.isSessionBefore24Hours = (session_date, session_time) => {
  // Combine session_date and session_time into a single datetime string
  const sessionDatetimeString = `${session_date} ${session_time}`;

  // Parse the session datetime string into a Moment.js object
  const sessionDatetime = moment(sessionDatetimeString, 'YYYY-MM-DD HH:mm');

  // Get the current datetime
  const currentDatetime = moment();

  // Calculate the difference in hours between the session datetime and the current datetime
  const hoursDifference = sessionDatetime.diff(currentDatetime, 'hours');

  // Check if the session can be added 24 hours or more from the current time
  if (hoursDifference >= 24) {
    return true; // Session can be added
  } else {
    return false; // Session cannot be added within 24 hours
  }
};


exports.generateSignature = (key, secret, meetingNumber, role) => {

  const iat = Math.round(new Date().getTime() / 1000) - 30
  const exp = iat + 60 * 60 * 2
  const oHeader = { alg: 'HS256', typ: 'JWT' }

  const oPayload = {
    sdkKey: key,
    appKey: key,
    mn: meetingNumber,
    role: role,
    iat: iat,
    exp: exp,
    tokenExp: exp
  }

  const sHeader = JSON.stringify(oHeader)
  const sPayload = JSON.stringify(oPayload)
  const sdkJWT = KJUR.jws.JWS.sign('HS256', sHeader, sPayload, secret)
  return sdkJWT
}

exports.generateZoomToken = async (req, res) => {
  try {
    const response = await axios.post('https://zoom.us/oauth/token', {}, {
      params: {
        grant_type: 'account_credentials',
        account_id: accountId
      },
      headers: {
        'Authorization': `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`
      }
    });

    // Here you have the access token
    const accessToken = response.data.access_token;

    // For example, list users
    const usersResponse = await axios.get('https://api.zoom.us/v2/users', {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });

    // Send user data as response
    res.send(usersResponse.data);
  } catch (error) {
    console.error('Error getting Zoom token', error);
    res.status(500).send('Error getting Zoom token');
  }
};