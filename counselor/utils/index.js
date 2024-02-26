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
