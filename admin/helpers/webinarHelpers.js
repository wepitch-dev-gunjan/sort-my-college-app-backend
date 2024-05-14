const { default: axios } = require('axios');

require('dotenv').config();
const { ZOOM_S2S_ACOUNT_ID, ZOOM_S2S_CLIENT_ID, ZOOM_S2S_CLIENT_SECRET, ZOOM_OAUTH_ENDPOINT } = process.env;

exports.getZoomAccessToken = async () => {
  try {
    // Make a request to Zoom OAuth endpoint to obtain access token
    const response = await axios.post(
      ZOOM_OAUTH_ENDPOINT,
      `grant_type=account_credentials&account_id=${ZOOM_S2S_ACOUNT_ID}`,
      {
        headers: {
          'Authorization': `Basic ${Buffer.from(`${ZOOM_S2S_CLIENT_ID}:${ZOOM_S2S_CLIENT_SECRET}`).toString('base64')}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );

    // Return the access token from the response
    return response.data.access_token;
  } catch (error) {
    console.error('Error getting Zoom access token:', error.response.data);
    throw new Error('Failed to get Zoom access token');
  }
}

exports.webinarDateModifier = (dateString) => {
  // Parse the input date string
  const date = new Date(dateString);
  // console.log(date)

  // Extract day, month, hour, and minute
  const day = date.getDate();
  const month = date.toLocaleString('default', { month: 'short' });
  const hour = date.getHours();
  const minute = date.getMinutes();

  // Determine the suffix for the day (st, nd, rd, th)
  let daySuffix;
  if (day === 1 || day === 21 || day === 31) {
    daySuffix = "st";
  } else if (day === 2 || day === 22) {
    daySuffix = "nd";
  } else if (day === 3 || day === 23) {
    daySuffix = "rd";
  } else {
    daySuffix = "th";
  }

  // Format the time
  let formattedTime = `${hour % 12}:${minute < 10 ? '0' : ''}${minute} ${hour >= 12 ? 'PM' : 'AM'}`;

  // Format the date
  let formattedDate = `${day}${daySuffix} ${month} @ ${formattedTime} Onwards`;

  return formattedDate;
}

exports.getDateDifference = (date1, date2) => {
  // Convert the date strings to Date objects
  const d1 = new Date(date1);
  const d2 = new Date(date2);

  // Calculate the difference in milliseconds
  const differenceMs = (Math.abs(d1 - d2));

  // Convert milliseconds to days
  const differenceDays = Math.floor(differenceMs / (1000 * 60 * 60 * 24));

  return differenceDays;
}