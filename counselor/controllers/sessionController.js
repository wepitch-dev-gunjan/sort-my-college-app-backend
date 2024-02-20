const { default: axios } = require("axios");
const {
  sessionTimeIntoMinutes,
  isSessionBefore24Hours,
  createMeeting,
  getSessionDateTime,
  isCounsellingSessionAvailable,
  sessionTimeIntoString,
} = require("../helpers/sessionHelpers");
require("dotenv").config();
const Counsellor = require("../models/Counsellor");
const Session = require("../models/Session");

const session_slots = 10;

const { BACKEND_URL } = process.env;
// GET
exports.getSessions = async (req, res) => {
  try {
    const { session_type, session_date } = req.query;
    const { counsellor_id } = req.params;

    const filter = { session_counsellor: counsellor_id };

    if (session_type) {
      filter.session_type = session_type;
    }

    if (session_date) {
      filter.session_date = new Date(session_date);
    }

    let sessions = await Session.find(filter);
    let total_available_slots = 0;

    if (sessions.length > 0) {
      const daysOfWeek = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ];

      const massagedSessions = sessions.map((session) => {
        total_available_slots += session.session_available_slots;
        const sessionDate = new Date(session.session_date);
        let session_massaged_date = "";

        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        if (sessionDate.toDateString() == today.toDateString()) {
          session_massaged_date = "today";
        } else if (sessionDate.toDateString() == tomorrow.toDateString()) {
          session_massaged_date = "tomorrow";
        } else {
          const dayDiff = Math.ceil(
            (sessionDate.getTime() - today.getTime()) / (1000 * 3600 * 24)
          );

          if (dayDiff <= 7 && dayDiff > 0) {
            session_massaged_date = daysOfWeek[sessionDate.getDay()];
            // session.session_date = daysOfWeek[sessionDate.getDay()].toString();
          } else {
            // Keep the original date if not within the next 7 days
            session_massaged_date = sessionDate.toDateString().slice(3);
            session.session_time = sessionTimeIntoString(session.session_time);
            console.log(session.session_time);
          }
        }
        return {
          ...session._doc,
          session_massaged_date,
        };
      });
      res.status(200).json({
        total_available_slots,
        sessions: massagedSessions,
      });
    } else {
      res.status(200).json({
        total_available_slots: 0,
        sessions: [],
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getSessionsForCounsellor = async (req, res) => {
  try {
    const {
      session_type,
      session_dates,
      session_status,
      session_fee,
      session_duration,
    } = req.query;
    const { counsellor_id } = req.params;

    const filter = { session_counsellor: counsellor_id };
    if (session_type && session_type !== "All") {
      filter.session_type = session_type;
    }

    if (session_dates && session_dates.length === 2) {
      const [startDate, endDate] = session_dates;

      filter.session_date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    if (session_status && session_status !== "All") {
      filter.session_status = session_status;
    }

    if (session_fee) {
      filter.session_fee = {
        $gte: session_fee[0],
        $lte: session_fee[1],
      };
    }

    if (session_duration) {
      filter.session_duration = { $lte: session_duration };
    }

    let sessions = await Session.find(filter);

    const massagedSessions = sessions.map((session) => {
      const session_time = sessionTimeIntoString(session.session_time);
      return { ...session._doc, session_time };
    });

    res.status(200).send(massagedSessions);
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

    const session_time = sessionTimeIntoString(counselingSession.session_time);
    const response = {
      ...counselingSession,
      session_time,
    };
    res.status(200).json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// POST
exports.addSession = async (req, res) => {
  try {
    // Extract data from the request body
    const { counsellor_id, refresh_token } = req;
    const {
      session_date,
      session_time,
      session_duration,
      session_type,
      session_fee,
    } = req.body;

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

    console.log(parsedSessionTime);
    // Check if session_date is a valid date and session_duration is a positive number
    if (
      isNaN(parsedSessionDate) ||
      isNaN(parsedSessionDuration) ||
      parsedSessionDuration <= 0
    ) {
      return res.status(400).send({
        error: "Invalid session_date or session_duration",
      });
    }

    // Check if a session is already there at the mentioned time
    const lowerTimeLimit = parsedSessionTime;
    const upperTimeLimit = parsedSessionTime + parsedSessionDuration;

    const existingSession = await Session.findOne({
      session_counsellor: counsellor_id,
      session_date: parsedSessionDate,
      session_time: {
        $gte: lowerTimeLimit,
        $lt: upperTimeLimit,
      },
    });

    if (existingSession) {
      return res.status(400).send({
        error: "A session already exists at this date and time",
      });
    }

    // Calculate start and end DateTimes for the meeting
    const startDateTime = getSessionDateTime(
      parsedSessionDate,
      parsedSessionTime
    );
    const endDateTime = getSessionDateTime(
      parsedSessionDate,
      parsedSessionTime + parsedSessionDuration
    );

    // Create Google Calendar event and get the meeting details
    const meetingDetails = await createMeeting(
      startDateTime,
      endDateTime,
      refresh_token
    );

    const newSession = new Session({
      session_counsellor: counsellor_id,
      session_time: parsedSessionTime,
      session_date: parsedSessionDate,
      session_duration: parsedSessionDuration,
      session_type,
      session_fee,
      session_slots: session_type === "Personal" ? 1 : session_slots,
      session_link: meetingDetails.data.hangoutLink,
    });

    // Save the new session to the database
    const createdSession = await newSession.save();

    res
      .status(200)
      .send({ message: "Session successfully added", session: createdSession });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      error: "Internal server error",
    });
  }
};

exports.bookSession = async (req, res) => {
  try {
    const { email } = req;

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

    counsellor.reward_points += 5;
    await counsellor.save();
    await axios.post(`${BACKEND_URL}/user/booking`, {
      booked_entity: counsellor,
      booking_type: "Counsellor",
      booking_data: session,
    });
    console.log(session);
    await axios.post(`${BACKEND_URL}/notification`, {
      user_id: counsellor._id,
      title: "New Booking",
      message: `${email} booked a ${session.session_type} session`,
    });

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
    // Extract data from the request body
    const { counsellor_id } = req;
    const { session_id } = req.params;
    const {
      session_date,
      session_time,
      session_duration,
      session_type,
      session_fee,
      session_status,
      session_available_slots,
    } = req.body;

    // Parse session_date and session_duration to Date objects
    const parsedSessionDate = new Date(session_date);
    const parsedSessionTime = sessionTimeIntoMinutes(session_time);
    const parsedSessionDuration = parseInt(session_duration, 10);

    // Validate session_date and session_duration
    if (
      isNaN(parsedSessionDate.getTime()) ||
      isNaN(parsedSessionDuration) ||
      parsedSessionDuration <= 0
    ) {
      return res
        .status(400)
        .json({ error: "Invalid session date or duration" });
    }

    // Check for existing session
    const sessionToUpdate = await Session.findById(session_id);

    if (!sessionToUpdate) {
      return res.status(404).json({ error: "Session not found" });
    }

    // Check if the session belongs to the counsellor
    if (sessionToUpdate.session_counselor.toString() !== counsellor_id) {
      return res
        .status(403)
        .json({ error: "You can only update your own sessions" });
    }

    // Check if the session is already booked and is not allowed to be changed
    if (
      sessionToUpdate.session_status === "Booked" &&
      session_status !== "Booked"
    ) {
      return res
        .status(400)
        .json({ error: "Cannot update a session that is already booked" });
    }

    // Calculate new time limits
    const lowerTimeLimit = parsedSessionTime - 30;
    const upperTimeLimit = parsedSessionTime + parsedSessionDuration;

    // Check for time conflicts
    const conflictingSession = await Session.findOne({
      _id: { $ne: session_id },
      session_counselor: counsellor_id,
      session_date: parsedSessionDate,
      session_time: {
        $gte: lowerTimeLimit,
        $lt: upperTimeLimit,
      },
    });

    if (conflictingSession) {
      return res
        .status(400)
        .json({ error: "A conflicting session exists at this date and time" });
    }

    // Update the session
    const updatedSession = await Session.findByIdAndUpdate(
      session_id,
      {
        session_date: parsedSessionDate,
        session_time: parsedSessionTime,
        session_duration: parsedSessionDuration,
        session_type,
        session_fee,
        session_status,
        session_available_slots,
        // Include any additional fields you want to update
      },
      { new: true }
    );

    if (!updatedSession) {
      return res.status(500).json({ error: "Failed to update the session" });
    }

    res.status(200).json({
      message: "Session updated successfully",
      session: updatedSession,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// DELETE
exports.deleteSession = async (req, res) => {
  try {
    const { counsellor_id } = req;
    const { session_id } = req.params;

    // Find the session to be deleted
    const counselingSession = await Session.findOne({
      _id: session_id,
      session_counsellor: counsellor_id,
    });

    if (!counselingSession) {
      return res.status(404).json({ message: "Session not found" });
    }

    const { session_status } = counselingSession;

    if (session_status === "Booked") {
      return res
        .status(400)
        .json({ error: "You can't delete a session after a user booked it" });
    }

    // Delete the session
    await Session.deleteOne({
      _id: session_id,
      session_counsellor: counsellor_id,
    });

    res.status(200).json({ message: "Session deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.cancelSession = async (req, res) => {
  try {
    const { counsellor_id } = req;
    const { session_id } = req.params;

    // Find and update the session to be cancelled
    const counselingSession = await Session.findOneAndUpdate(
      {
        _id: session_id,
        session_counselor: counsellor_id,
        session_status: "Booked",
      },
      { $set: { session_status: "Cancelled" } },
      { new: true } // This option returns the modified document
    );

    if (!counselingSession) {
      return res
        .status(404)
        .json({ message: "Session not found or already cancelled" });
    }

    res.status(200).json({
      message: "Session cancelled successfully",
      session: counselingSession,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// need to be changed
exports.rescheduleSession = async (req, res) => {
  try {
    // Extract data from the request body
    const { counsellor_id, refresh_token } = req;
    const { session_id } = req.params;
    const {
      session_date,
      session_time,
      session_duration,
      session_type,
      session_fee,
    } = req.body;

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

    // Check for overlapping sessions
    const existingSession = await Session.findOne({
      _id: session_id,
      session_counselor: counsellor_id,
    });

    if (!existingSession) {
      return res.status(404).json({ message: "Session not found" });
    }

    const overlappingSession = await Session.findOne({
      _id: { $ne: session_id },
      session_date: parsedSessionDate,
      session_time: {
        $gte: lowerTimeLimit,
        $lt: upperTimeLimit,
      },
    });

    if (overlappingSession) {
      return res.status(400).send({
        error: "A session already exists at the rescheduled date and time",
      });
    }

    // Calculate start and end DateTimes for the rescheduled meeting
    const startDateTime = getSessionDateTime(
      parsedSessionDate,
      parsedSessionTime
    );
    const endDateTime = getSessionDateTime(
      parsedSessionDate,
      parsedSessionTime + parsedSessionDuration
    );

    // Update the session with new details
    existingSession.session_date = parsedSessionDate;
    existingSession.session_time = parsedSessionTime;
    existingSession.session_duration = parsedSessionDuration;
    existingSession.session_type = session_type;
    existingSession.session_fee = session_fee;
    existingSession.session_slots =
      session_type === "Personal" ? 1 : session_slots;

    // Create or update Google Calendar event and get the meeting details
    const meetingDetails = await createOrUpdateMeeting(
      existingSession.session_link,
      startDateTime,
      endDateTime,
      refresh_token
    );

    // Update the session link with the new meeting link
    existingSession.session_link = meetingDetails.data.hangoutLink;

    // Save the updated session to the database
    const updatedSession = await existingSession.save();

    res.status(200).send({
      message: "Session successfully rescheduled",
      session: updatedSession,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      error: "Internal server error",
    });
  }
};

exports.getTotalSessionsCount = async (req, res) => {
  try {
    const { counsellor_id } = req;
    const totalSessions = await Session.find({
      session_counsellor: counsellor_id,
    }).countDocuments();
    res.status(200).json({ totalSessions });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
