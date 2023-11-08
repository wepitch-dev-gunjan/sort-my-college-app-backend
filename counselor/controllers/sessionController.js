const {
  sessionTimeIntoMinutes,
  isSessionBefore24Hours,
  generateSignature,
} = require("../helpers/sessionHelpers");
const Counsellor = require("../models/Counsellor");
const Session = require("../models/Session");

const session_slots = 10;
// GET
exports.getSessions = async (req, res) => {
  try {
    const { session_type, session_date, session } = req.query;
    const { counsellor_id } = req.params;

    // Check if a status query is requested
    const counselingSessions = await Session.find({
      session_counselor: counsellor_id,
    });

    if (!counselingSessions)
      res.status(200).json({ message: "Sessions not found" });

    res.status(200).json(counselingSessions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getSession = async (req, res) => {
  try {
    const { session_id } = req.params;

    // Check if a status query is requested
    const counselingSession = await Session.findOne({
      _id: session_id,
    });

    if (!counselingSession)
      res.status(200).json({ message: "Session not found" });

    res.status(200).json(counselingSession);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// POST
exports.addSession = async (req, res) => {
  try {
    // Extract data from the request body
    const {
      counsellor_id,
      session_date,
      session_time,
      session_duration,
      session_type,
      session_fee,
    } = req.body;

    const counsellor = await Counsellor.findOne({ _id: counsellor_id });
    if (!counsellor)
      return res.status(404).send({
        error: "Counsellor not found",
      });

    if (!isSessionBefore24Hours(session_date, session_time)) {
      return res
        .status(404)
        .json({ error: "Can't add session before 24 hours" });
    }

    // Check if any of the required fields are missing
    if (
      !session_date ||
      !session_time ||
      !session_duration ||
      !session_type ||
      !session_fee
    ) {
      return res.status(400).send({
        error: "Missing required fields",
      });
    }

    // Parse session_date and session_duration to Date objects
    const parsedSessionDate = new Date(session_date);
    const parsedSessionTime = sessionTimeIntoMinutes(session_time);
    const parsedSessionDuration = parseInt(session_duration, 10);

    // Check if session_date is a valid date and session_duration is a positive number
    if (
      isNaN(parsedSessionDate) ||
      isNaN(parsedSessionDuration) ||
      parsedSessionDuration <= 0
    ) {
      return res.status(400).send({
        error: "Invalid session_date",
      });
    }

    const lowerTimeLimit = parsedSessionTime - 30;
    const upperTimeLimit = parsedSessionTime + parsedSessionDuration;

    const existingSession = await Session.findOne({
      session_date: parsedSessionDate,
      session_time: {
        $gte: lowerTimeLimit, // Replace with the lower limit of session_time
        $lt: upperTimeLimit, // Replace with the upper limit of session_time
      },
    });

    if (existingSession) {
      return res.status(400).send({
        error: "A session already exists at this date and time",
      });
    }

    const meeting_sdk_jwt = await generateSignature(
      process.env.ZOOM_CLIENT_ID,
      process.env.ZOOM_CLIENT_SECRET,
      123456789,
      0
    );

    // Create a new session object with Zoom meeting details
    const newSession = new Session({
      session_counselor: counsellor_id,
      session_time: parsedSessionTime,
      session_date: parsedSessionDate,
      session_duration: parsedSessionDuration,
      session_type,
      session_fee,
      session_slots: session_type === "Personal" ? 1 : session_slots,
      meeting_sdk_jwt,
    });

    // Save the new session to the database
    const createdSession = await newSession.save();

    res.status(200).send(createdSession);
  } catch (error) {
    console.error(error);
    res.status(500).send({
      earror: "Internal server error",
    });
  }
};

exports.bookSession = async (req, res) => {
  try {
    const { session_id } = req.params;

    let session = await Session.findOne({ _id: session_id });
    if (!session) {
      return res.status(404).json({ error: "Session not found" });
    }

    // Check if the session is available
    const isSessionAvailable = isCounsellingSessionAvailable(session_id);
    if (!isSessionAvailable) {
      return res.status(400).json({ error: "Session is not available" });
    }

    // check the slots availability
    if (session.session_available_slots <= 0) {
      return res.status(400).send({
        error:
          "There are no booking slots available in this session, please book another session",
      });
    }

    session.session_available_slots--;
    if (session.session_available_slots <= 0) {
      session.session_status = "Booked";
    }

    const counsellor = await Counsellor.findOne({
      _id: session.session_counsellor,
    });
    if (!counsellor)
      return res.status(404).send({
        error:
          "Counselor has left the account, please choose another counselor",
      });

    const sessionDateTime = new Date(
      `${session.session_date} ${session.session_time}`
    );
    const nextSessionDateTime = new Date(`${counsellor.next_session_time}`);

    // Compare session times and update next_session_time if needed
    if (sessionDateTime > nextSessionDateTime) {
      counsellor.next_session_time = sessionDateTime;
    }

    // Save the updated session and counselor data
    await session.save();
    await counsellor.save();

    // Respond with a success message
    res.status(201).json({ message: "Counseling session booked successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

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

    if (session_status === "Booked") {
      return res.status(400).json({
        error: "You can't updtae a session status after a user booked it",
      });
    }
    // Find the counseling session by ID
    const counselingSession = await Session.findById(session_id);

    if (!counselingSession) {
      return res.status(404).json({ error: "Counseling session not found" });
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
      return res
        .status(404)
        .json({ error: "Can't add session before 24 hours" });
    }

    // Save the updated counseling session
    await counselingSession.save();

    // Respond with a success message
    res
      .status(200)
      .json({ message: "Counseling session updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
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
      session_counselor: id,
    });

    if (!counselingSession)
      res.status(200).json({ message: "Session not found" });

    const { session_status } = counselingSession;

    if (session_status === "Booked") {
      return res.status(400).json({
        error: "You can't updtae a session status after a user booked it",
      });
    }

    res.status(200).json(counselingSession);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// these controller are not done
exports.rescheduleSession = async (req, res) => {
  try {
    const { id } = req;
    const { session_id } = req.params;

    // Check if a status query is requested
    const counselingSession = await Session.findOne({
      _id: session_id,
      session_counselor: id,
    });

    if (!counselingSession)
      res.status(200).json({ message: "Session not found" });

    const { session_status } = counselingSession;

    if (session_status === "Booked") {
      return res.status(400).json({
        error: "You can't updtae a session status after a user booked it",
      });
    }

    res.status(200).json(counselingSession);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.cancelSession = async (req, res) => {
  try {
    const { id } = req;
    const { session_id } = req.params;

    // Check if a status query is requested
    const counselingSession = await Session.findOne({
      _id: session_id,
      session_counselor: id,
    });

    if (!counselingSession)
      res.status(200).json({ message: "Session not found" });

    const { session_status } = counselingSession;

    if (session_status === "Booked") {
      return res.status(400).json({
        error: "You can't updtae a session status after a user booked it",
      });
    }

    res.status(200).json(counselingSession);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
