exports.formatObjectId = (str) => {
  if (typeof str !== 'string') {
    throw new Error('Input is not a string');
  }

  const regex = /new\sObjectId\("([a-f\d]+)"\)/;
  const match = str.match(regex);

  if (match && match[1]) {
    return match[1];
  } else {
    throw new Error('ID not found or invalid format');
  }
};

exports.convertTo24HourFormat = (timeString) => {
  let hours = timeString / 60;
  const minutes = timeString % 60;
  const period = hours >= 12 ? 'pm' : 'am';

  // Convert 24-hour format to 12-hour format
  hours = hours % 12 || 12;

  // Format hours and minutes to always be two digits
  const formattedHour = hours < 10 ? `0${hours}` : `${hours}`;
  const formattedMinute = minutes < 10 ? `0${minutes}` : `${minutes}`;

  return `${formattedHour}:${formattedMinute} ${period}`;
}


