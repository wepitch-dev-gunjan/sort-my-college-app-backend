const { sessionTimeIntoMinutes, isSessionBefore24Hours } = require("../helpers/sessionHelpers");
const Session = require("../models/Session");

// GET
exports.getSessions = async (req, res) => {
  try {
    const { counsellor_id } = req.params;

    // Check if a status query is requested
    const counselingSessions = await Session.find({
      session_counselor: counsellor_id
    });

    if (!counselingSessions)
      res.status(200).json({ message: "Sessions not found" });

    res.status(200).json(counselingSessions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getSession = async (req, res) => {
  try {
    const { session_id } = req.params;

    // Check if a status query is requested
    const counselingSessions = await Session.findOne({
      _id: session_id,
    });

    if (!counselingSessions)
      res.status(200).json({ message: "Session not found" });

    res.status(200).json(counselingSessions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// POST
exports.addSession = async (req, res) => {
  try {
    // Extract data from the request body
    const { counsellor_id } = req.params;
    const { session_date, session_time, session_duration, session_type, session_fee } = req.body;

    if (!isSessionBefore24Hours(session_date, session_time)) {
      return res.status(404).json({ error: "Can't add session before 24 hours" })
    }

    // Check if any of the required fields are missing
    if (!session_date || !session_time || !session_duration || !session_type || !session_fee) {
      return res.status(400).send({
        error: "Missing required fields"
      })
    }

    // Parse session_date and session_duration to Date objects
    const parsedSessionDate = new Date(session_date);
    const parsedSessionTime = sessionTimeIntoMinutes(session_time);
    const parsedSessionDuration = parseInt(session_duration, 10);

    // Check if session_date is a valid date and session_duration is a positive number
    if (isNaN(parsedSessionDate) || isNaN(parsedSessionDuration) || parsedSessionDuration <= 0) {
      return res.status(400).send({
        error: "Invalid session_date"
      })
    }

    const lowerTimeLimit = parsedSessionTime - 30;
    const upperTimeLimit = parsedSessionTime + parsedSessionDuration;

    const existingSession = await Session.findOne({
      session_date: parsedSessionDate,
      session_time: {
        $gte: lowerTimeLimit, // Replace with the lower limit of session_time
        $lt: upperTimeLimit,    // Replace with the upper limit of session_time
      },
    });

    if (existingSession) {
      return res.status(400).send({
        error: "A session already exists at this date and time"
      });
    }

    // Create a new session object
    const newSession = new Session({
      session_counselor: counsellor_id,
      session_time: parsedSessionTime,
      session_date: parsedSessionDate,
      session_duration: parsedSessionDuration,
      session_type,
      session_fee,
    });

    // Save the new session to the database
    const createdSession = await newSession.save();
    res.status(200).send(createdSession);
  } catch (error) {
    console.error(error);
    res.status(500).send({
      earror: "Internal server error"
    })
  }
};


exports.bookSession = async (req, res) => {
  try {
    const { sessionId, counselor, email, sessionType } = req.body;

    // Check if the user with the provided ID exists
    const userId = await getUserIdByEmail(email);
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const counselingSession = await CounselingSession.findOne(sessionId)
    if (!counselingSession) {
      return res.status(404).json({ error: 'Counseling session not found' });
    }

    // Check if the session is available
    const isSessionAvailable = isCounsellingSessionAvailable(sessionId);

    if (!isSessionAvailable) {
      return res.status(400).json({ error: 'Counseling session is not available' });
    }

    // Add booking details to the counseling session
    const newCounselingSession = new CounselingSession({
      counselor,
      sessionId,
      user: userId,
      sessionType
    });

    // Save the updated counseling session
    await newCounselingSession.save();
    globalSocket.emit('bookingsUpdated', newCounselingSession);

    // Respond with a success message
    res.status(201).json({ message: 'Counseling session booked successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

// PUT
exports.updateSession = async (req, res) => {
  try {
    const { session_id } = req.params;

    // Extract updated data from the request body
    const {
      session_type,
      session_date,
      session_time,
      session_duration,
      session_status,
    } = req.body;

    if (session_status === 'Booked') {
      return res.status(400).json({ error: "You can't updtae a session status after a user booked it" });
    }
    // Find the counseling session by ID
    const counselingSession = await Session.findById(session_id);

    if (!counselingSession) {
      return res.status(404).json({ error: 'Counseling session not found' });
    }

    // Update the attributes
    if (session_status) {
      Session.session_status = session_status;
    }
    if (session_duration) {
      Session.session_duration = session_duration;
    }
    if (session_type) {
      Session.session_type = session_type;
    }
    if (session_date) {
      Session.session_date = session_date;
    }
    if (session_time) {
      Session.session_time = session_time;
    }

    if (!isSessionBefore24Hours(session_date, session_time)) {
      return res.status(404).json({ error: "Can't add session before 24 hours" })
    }

    // Save the updated counseling session
    await counselingSession.save();

    // Respond with a success message
    res.status(200).json({ message: 'Counseling session updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// DELETE 
exports.deleteSession = async (req, res) => {
  try {
    const { id } = req;
    const { session_id } = req.params;

    // Check if a status query is requested
    const counselingSession = await Session.findOne({
      _id: session_id,
      session_counselor: id
    });

    if (!counselingSession)
      res.status(200).json({ message: "Session not found" });

    const { session_status } = counselingSession;

    if (session_status === 'Booked') {
      return res.status(400).json({ error: "You can't updtae a session status after a user booked it" });
    }

    res.status(200).json(counselingSession);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};