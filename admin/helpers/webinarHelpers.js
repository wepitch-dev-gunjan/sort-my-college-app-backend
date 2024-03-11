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