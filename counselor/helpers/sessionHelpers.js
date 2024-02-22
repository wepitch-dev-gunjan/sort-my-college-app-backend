const { google } = require("googleapis");
const moment = require("moment/moment");
const Session = require("../models/Session");
require("dotenv").config();
const {
  FRONTEND_URL,
  OAUTH2_CLIENT_ID,
  OAUTH2_CLIENT_SECRET,
  OAUTH2_REDIRECT_URI,
} = process.env;

const oauth2Client = new google.auth.OAuth2(
  OAUTH2_CLIENT_ID,
  OAUTH2_CLIENT_SECRET,
  OAUTH2_REDIRECT_URI
);

const calendar = google.calendar({ version: "v3", auth: oauth2Client });

exports.sessionTimeIntoMinutes = (time) => {
  const sessionTime = time;

  // Split the session time into hours and minutes
  const [hours, minutes] = sessionTime.split(":").map(Number);

  // Calculate the total minutes from the start of the day (midnight)
  return hours * 60 + minutes;
};

exports.sessionTimeIntoString = (time) => {
  // Split the session time into hours and minutes
  const hours = Math.floor(time / 60);
  const minutes = time % 60;

  // Calculate the total minutes from the start of the day (midnight)
  return `${hours}:${minutes}`;
};

exports.isCounsellingSessionAvailable = async (sessionId) => {
  const session = await Session.findOne({
    _id: sessionId,
    status: "Available",
  });
  return session ? true : false;
};

exports.isSessionBefore24Hours = (session_date, session_time) => {
  // Combine session_date and session_time into a single datetime string
  const sessionDatetimeString = `${session_date}T${session_time}`;
  console.log(sessionDatetimeString);

  // Parse the session datetime string into a Moment.js object
  const sessionDatetime = moment(sessionDatetimeString);

  // Get the current datetime
  const currentDatetime = moment();

  // Calculate the difference in hours between the session datetime and the current datetime
  const hoursDifference = sessionDatetime.diff(currentDatetime, "hours", true);

  // Check if the session is at least 24 hours away from the current time
  return hoursDifference >= 24;
};

exports.createMeeting = async (startTime, endTime, refresh_token) => {
  oauth2Client.setCredentials({
    refresh_token,
  });
  const event = {
    summary: "Counseling Session",
    description: "A virtual meeting for counseling.",
    start: {
      dateTime: startTime, // '2023-11-07T09:00:00-07:00'
      timeZone: "America/Los_Angeles",
    },
    end: {
      dateTime: endTime, // '2023-11-07T10:00:00-07:00'
      timeZone: "America/Los_Angeles",
    },
    conferenceData: {
      createRequest: { requestId: "counsellor" },
    },
  };

  const response = await calendar.events.insert({
    calendarId: "primary",
    resource: event,
    conferenceDataVersion: 1,
  });

  return response;
};

// Helper function to convert session time into a Date object
exports.getSessionDateTime = (date, minutes) => {
  const dateTime = new Date(date);
  dateTime.setMinutes(dateTime.getMinutes() + minutes);
  return dateTime;
};
