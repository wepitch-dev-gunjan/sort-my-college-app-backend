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