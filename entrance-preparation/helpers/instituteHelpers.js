const axios = require('axios');
const jwt = require('jsonwebtoken');

const { JWT_SECRET } = process.env;
exports.generateToken = (user, expiresIn) => {
  return jwt.sign(user, JWT_SECRET, { expiresIn });
};

exports.verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded;
  } catch (error) {
    console.log(error)
    return null;
  }
}


async function getLocationInfo(geonamesID) {
  try {
    // Make a GET request to the Geonames API to retrieve location information
    const response = await axios.get(`http://api.geonames.org/getJSON?geonameId=${geonamesID}&username=your_username`);

    // Extract the relevant information from the API response
    const country = response.data.countryName;
    const state = response.data.adminName1;
    const city = response.data.name;

    // Create an array with the location information
    const locationInfo = [country, state, city];

    return locationInfo;
  } catch (error) {
    console.error('Error retrieving location information:', error.message);
    return null; // Return null in case of an error
  }
}

exports.convertTo24HourFormat = (timeString) => {
  let [hourStr, period] = timeString.split(' ');
  let [hour, minute] = hourStr.split(':').map(Number);

  if (period === 'pm' && hour !== 12) {
    hour += 12;
  } else if (period === 'am' && hour === 12) {
    hour = 0;
  }

  return hour;
}

exports.getDayFromDate = (dateString) => {
  // Define an array of day names
  const dayNames = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];

  // Create a new Date object from the provided date string
  const date = new Date(dateString.split('T')[0]);

  // Get the day of the week (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
  const dayOfWeek = date.getDay();

  // Return the day of the week name
  return dayNames[dayOfWeek];
};

exports.getSlotsFromTotalSlots = (startTime, totalSlots) => {
  const slots = [];
  let currentHour = startTime;

  for (let i = 0; i < totalSlots; i++) {
    const startSlot = formatHour(currentHour);
    const endSlot = formatHour(currentHour + 1);

    const slot = `${startSlot} - ${endSlot}`;
    slots.push(slot);

    currentHour++;
  }

  return slots;
};

const formatHour = (hour) => {
  // Convert hour to 12-hour format
  const hour12 = hour % 12 || 12;
  // Determine AM or PM
  const period = hour <= 12 ? 'am' : 'pm';

  // Format the hour
  const formattedHour = `${hour12.toString().padStart(2, '0')}:00 ${period}`;

  return formattedHour;
};


exports.week = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY']