const { sessionTimeIntoMinutes } = require("../helpers/sessionHelpers");
const Counsellor = require("../models/Counsellor");
const Session = require("../models/Session");
const CounselingSession = require("../models/Session");
const globalSocket = require("../server");

// GET
exports.getSessions = async (req, res) => {
  try {
    const { status } = req.query;
    const { counselor } = req.params;

    // Check if a status query is requested
    if (status) {
      const counselingSessions = await CounselingSession.find({
        counselor,
        status,
      });

      res.status(200).json(counselingSessions);
    } else {
      // If no status query is requested, send all sessions of the counselor
      const allCounselingSessions = await CounselingSession.find({
        counselor,
      });

      res.status(200).json(allCounselingSessions);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// POST
exports.addSession = async (req, res) => {
  try {
    // Extract data from the request body
    const { id } = req;
    const { session_date, session_time, session_duration, session_type, session_fee } = req.body;

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
      return;
    }

    // Create a new session object
    const newSession = new Session({
      session_counselor: id,
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
    const { sessionId } = req.params;

    // Extract updated data from the request body
    const {
      sessionType,
      sessionDate,
      duration,
      status,
    } = req.body;

    // Find the counseling session by ID
    const counselingSession = await CounselingSession.findById(sessionId);

    if (!counselingSession) {
      return res.status(404).json({ error: 'Counseling session not found' });
    }

    // Update the attributes
    if (status) {
      counselingSession.status = status;
    }
    if (duration) {
      counselingSession.duration = duration;
    }
    if (sessionType) {
      counselingSession.sessionType = sessionType;
    }
    if (sessionDate) {
      counselingSession.sessionDate = sessionDate;
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