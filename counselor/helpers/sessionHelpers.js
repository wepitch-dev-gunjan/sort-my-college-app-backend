const moment = require("moment/moment");

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