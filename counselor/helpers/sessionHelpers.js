const { google } = require("googleapis");
const moment = require("moment/moment");
require('dotenv').config();
const { FRONTEND_URL, OAUTH2_CLIENT_ID, OAUTH2_CLIENT_SECRET, OAUTH2_REDIRECT_URI } = process.env;

const oauth2Client = new google.auth.OAuth2(OAUTH2_CLIENT_ID, OAUTH2_CLIENT_SECRET, OAUTH2_REDIRECT_URI);

const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

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

exports.createMeeting = async (startTime, endTime, refresh_token) => {
  oauth2Client.setCredentials({
    refresh_token
  });
  const event = {
    summary: 'Counseling Session',
    description: 'A virtual meeting for counseling.',
    start: {
      dateTime: startTime, // '2023-11-07T09:00:00-07:00'
      timeZone: 'America/Los_Angeles',
    },
    end: {
      dateTime: endTime, // '2023-11-07T10:00:00-07:00'
      timeZone: 'America/Los_Angeles',
    },
    conferenceData: {
      createRequest: { requestId: "counsellor" },
    },
  };

  const response = await calendar.events.insert({
    calendarId: 'primary',
    resource: event,
    conferenceDataVersion: 1,
  });

  return response;
}

// Helper function to convert session time into a Date object
exports.getSessionDateTime = (date, minutes) => {
  const dateTime = new Date(date);
  dateTime.setMinutes(dateTime.getMinutes() + minutes);
  return dateTime;
}