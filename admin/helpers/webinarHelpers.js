const { default: axios } = require("axios");
const moment = require("moment-timezone");

require("dotenv").config();
const {
  ZOOM_S2S_ACOUNT_ID,
  ZOOM_S2S_CLIENT_ID,
  ZOOM_S2S_CLIENT_SECRET,
  ZOOM_OAUTH_ENDPOINT,
} = process.env;

exports.getZoomAccessToken = async () => {
  try {
    // Make a request to Zoom OAuth endpoint to obtain access token
    const response = await axios.post(
      ZOOM_OAUTH_ENDPOINT,
      `grant_type=account_credentials&account_id=${ZOOM_S2S_ACOUNT_ID}`,
      {
        headers: {
          Authorization: `Basic ${Buffer.from(
            `${ZOOM_S2S_CLIENT_ID}:${ZOOM_S2S_CLIENT_SECRET}`
          ).toString("base64")}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    // Return the access token from the response
    return response.data.access_token;
  } catch (error) {
    console.error("Error getting Zoom access token:", error.response.data);
    throw new Error("Failed to get Zoom access token");
  }
};

exports.webinarDateModifier = (dateString) => {
  // Parse the input date string (assuming it's in ISO 8601 format)
  const date = new Date(dateString);

  // Add 5 hours and 30 minutes to convert to IST
  date.setHours(date.getHours());
  date.setMinutes(date.getMinutes());
  // Extract day, month, hour, and minute
  const day = date.getDate();
  const month = date.toLocaleString("default", { month: "short" });
  let hour = date.getHours();
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

  // Convert hour to 12-hour format and determine AM/PM
  const meridiem = hour >= 12 ? "PM" : "AM";
  hour = hour % 12 || 12;

  // Format the time
  let formattedTime = `${hour}:${minute < 10 ? "0" : ""}${minute} ${meridiem}`;

  // Format the date
  let formattedDate = `${day}${daySuffix} ${month} @ ${formattedTime} Onwards`;

  return formattedDate;
};

exports.getDateDifference = (date1, date2) => {
  // Convert the date strings to Date objects
  const d1 = new Date(date1);
  const d2 = new Date(date2);

  // Calculate the difference in milliseconds
  const differenceMs = Math.abs(d1 - d2);

  // Convert milliseconds to days
  const differenceDays = Math.floor(differenceMs / (1000 * 60 * 60 * 24));

  return differenceDays;
};

exports.convertTo12HourFormat = (timeString) => {
  const [hourString, minuteString] = timeString.split(":");
  let hours = parseInt(hourString, 10);
  const minutes = parseInt(minuteString, 10);
  const period = hours >= 12 ? "pm" : "am";

  // Convert 24-hour format to 12-hour format
  hours = hours % 12 || 12;

  // Format hours and minutes to always be two digits
  const formattedHour = hours < 10 ? `0${hours}` : `${hours}`;
  const formattedMinute = minutes < 10 ? `0${minutes}` : `${minutes}`;

  return `${formattedHour}:${formattedMinute} ${period}`;
};
