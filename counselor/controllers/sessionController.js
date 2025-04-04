const { default: axios } = require("axios");
const cron = require('node-cron')
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
const User = require("../dbQueries/user/iidex");

const { BACKEND_URL } = process.env;
// GET
exports.getSessions = async (req, res) => {
  try {
    const { session_type, session_date } = req.query;
    const { counsellor_id } = req.params;
    const filter = { session_counsellor: counsellor_id };
    // Add session type to the filter if provided
    if (session_type) {
      filter.session_type = session_type;
    }
    // Add session date to the filter if provided
    if (session_date) {
      filter.session_date = new Date(session_date);
      if (isNaN(filter.session_date)) {
        return res.status(400).json({ error: "Invalid session date" });
      }
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
        // Determine the session massaged date
        if (sessionDate.toDateString() === today.toDateString()) {
          session_massaged_date = "today";
        } else if (sessionDate.toDateString() === tomorrow.toDateString()) {
          session_massaged_date = "tomorrow";
        } else {
          const dayDiff = Math.ceil(
            (sessionDate.getTime() - today.getTime()) / (1000 * 3600 * 24)
          );
          if (dayDiff <= 7 && dayDiff > 0) {
            session_massaged_date = daysOfWeek[sessionDate.getDay()];
          } else {
            // Keep the original date if not within the next 7 days
            session_massaged_date = sessionDate.toDateString().slice(3);
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
    res.status(500).json({ error: error.message });
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
      const sessionTimeMinutes = session.session_time;
      const currentTime = new Date();
      const sessionTimeEpoch = new Date(currentTime);
      sessionTimeEpoch.setHours(Math.floor(sessionTimeMinutes / 60));
      sessionTimeEpoch.setMinutes(sessionTimeMinutes % 60);
      sessionTimeEpoch.setSeconds(0);
      sessionTimeEpoch.setMilliseconds(0);
      const threshold = 30 * 60 * 1000; // 30 minutes
      const isAboutToStart =
        Math.abs(sessionTimeEpoch - currentTime) <= threshold;
      return {
        ...session._doc,
        session_time,
        // is_about_to_start: isAboutToStart,
      };
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
      res.status(404).json({ message: "Session not found" });

    // Convert session time from minutes past midnight to milliseconds since epoch
    const sessionTimeMinutes = counselingSession.session_time;
    const currentTime = new Date();
    const sessionTimeEpoch = new Date(currentTime);
    sessionTimeEpoch.setHours(Math.floor(sessionTimeMinutes / 60));
    sessionTimeEpoch.setMinutes(sessionTimeMinutes % 60);
    sessionTimeEpoch.setSeconds(0);
    sessionTimeEpoch.setMilliseconds(0);

    // Define the threshold for 'about to start' in milliseconds
    const threshold = 30 * 60 * 1000; // 30 minutes

    // Check if the session time is within the threshold
    const isAboutToStart =
      Math.abs(sessionTimeEpoch - currentTime) <= threshold;

    const session_time = sessionTimeIntoString(counselingSession.session_time);
    const allSessions = await Session.find({});
    let count = 0;

    allSessions.forEach((session) => {
      if (session.session_counsellor === counselingSession.session_counsellor) {
        if (session.session_available_slots < session.session_slots) {
          count++;
        }
      }
    });
    const response = {
      ...counselingSession.toObject(),
      session_time,
      is_about_to_start: isAboutToStart,
      booked_sessions: count,
    };

    res.status(200).json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

//======================= Add Session With Firebase Notificaion for Users !=========================

exports.addSession = async (req, res) => {
  try {
    // Extract data from the request body
    const { counsellor_id, refresh_token } = req;
    const {
      session_topic,
      session_date,
      session_time,
      session_duration,
      session_type,
      session_fee,
      session_available_slots: session_slots,
    } = req.body;

    // Check if any of the required fields are missing
    if (
      !session_date ||
      !session_time ||
      !session_duration ||
      !session_type ||
      !session_fee
    ) {
      return res.status(400).send({ error: "Missing required fields" });
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
      return res
        .status(400)
        .send({ error: "Invalid session_date or session_duration" });
    }

    // Ensure session_date is not in the past
    if (parsedSessionDate < new Date().setHours(0, 0, 0, 0)) {
      return res
        .status(400)
        .send({ error: "Session date cannot be in the past" });
    }

    // Check if a session is already there at the mentioned time and validate the 30-minute gap
    const lowerTimeLimit = parsedSessionTime;
    const upperTimeLimit = parsedSessionTime + parsedSessionDuration;

    const existingSessions = await Session.find({
      session_counsellor: counsellor_id,
      session_date: parsedSessionDate,
    });

    for (let session of existingSessions) {
      const existingSessionStart = session.session_time;
      const existingSessionEnd =
        session.session_time + session.session_duration;

      // Check for overlapping session or within 30-minute buffer
      if (
        (lowerTimeLimit < existingSessionEnd &&
          upperTimeLimit > existingSessionStart) ||
        (lowerTimeLimit < existingSessionEnd + 30 &&
          lowerTimeLimit >= existingSessionEnd)
      ) {
        return res.status(400).send({
          error:
            "A session already exists at this date and time or within the 30-minute buffer period",
        });
      }
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

    // Adjusting the start and end times by subtracting 5 hours and 30 minutes
    const adjustedStartDateTime = new Date(startDateTime);
    adjustedStartDateTime.setHours(adjustedStartDateTime.getHours() - 5);
    adjustedStartDateTime.setMinutes(adjustedStartDateTime.getMinutes() - 30);

    const adjustedEndDateTime = new Date(endDateTime);
    adjustedEndDateTime.setHours(adjustedEndDateTime.getHours() - 5);
    adjustedEndDateTime.setMinutes(adjustedEndDateTime.getMinutes() - 30);

    // Create Google Calendar event and get the meeting details
    const meetingDetails = await createMeeting(
      adjustedStartDateTime,
      adjustedEndDateTime,
      refresh_token
    );

    const newSession = new Session({
      session_topic,
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

    // Fetch counsellor details
    const counsellor = await Counsellor.findById(counsellor_id);

    // Extract counsellor name or fallback to "Unknown Counsellor"
    const counsellor_name = counsellor ? counsellor.name : "Unknown Counsellor";

    // Convert session_date from YYYY-MM-DD to DD-MM-YYYY
    const formattedDate = new Date(session_date).toLocaleDateString("en-GB").split("/").join("-");

    // Convert session_time from 24-hour format to 12-hour format
    const formattedTime = new Date(`1970-01-01T${session_time}`).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });

    // **Send notification to the counsellor**
    const notificationData = {
      topic: `counsellor_${counsellor_id}`, // Dynamic topic for each counsellor
      title: `New ${session_type} Session Added by ${counsellor_name}`,
      body: `${session_topic} scheduled on ${formattedDate} at ${formattedTime}`,
      type: "session",
      id: counsellor_id.toString(),
    };

    await axios.post(
      `${BACKEND_URL}/notification/send-notification-to-topic`,
      notificationData
    );

    res
      .status(200)
      .send({ message: "Session successfully added", session: createdSession });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Internal server error" });
  }

  // Utility Functions
  function sessionTimeIntoMinutes(timeStr) {
    // Implement the function to convert time string (e.g., "14:30") to minutes since midnight
    const [hours, minutes] = timeStr.split(":").map(Number);
    return hours * 60 + minutes;
  }

  function getSessionDateTime(date, timeInMinutes) {
    // Implement the function to combine date and timeInMinutes into a DateTime object
    const dateTime = new Date(date);
    dateTime.setMinutes(dateTime.getMinutes() + timeInMinutes);
    return dateTime;
  }

  // async function createMeeting(startDateTime, endDateTime, refreshToken) {
  //   // Implement the function to create a Google Calendar event using the provided parameters
  //   // This should return the meeting details including the hangout link
  //   // Example:
  //   // const event = {
  //   //   summary: 'Counselling Session',
  //   //   start: { dateTime: startDateTime },
  //   //   end: { dateTime: endDateTime },
  //   //   // ... other event details ...
  //   // };
  //   // const meetingDetails = await googleCalendarClient.createEvent(event, refreshToken);
  //   // return meetingDetails;
  // }
};


exports.bookSessionValidation = async (req, res) => {
  try {
    const { phone_number, id, email } = req;

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

    const counsellor = await Counsellor.findOne({
      _id: session.session_counsellor,
    });
    if (!counsellor)
      return res.status(404).send({
        error:
          "Counselor has left the account, please choose another counselor",
      });

    if (session.session_users.includes(id))
      return res.status(400).send({
        error: "user is already registered",
      });

    // Respond with a success message
    res.status(201).json({ message: "Proceed to payment " });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal  booking Server Error" });
  }
};

// exports.bookSession = async (req, res) => {
//   try {
//     const { phone_number, id } = req;
//     const user = await User.findOne({ _id: id });

//     const { session_id } = req.params;

//     let session = await Session.findOne({ _id: session_id });

//     const counsellor = await Counsellor.findOne({
//       _id: session.session_counsellor,
//     });

//     const sessionDateTime = new Date(
//       `${session.session_date} ${session.session_time}`
//     );
//     const nextSessionDateTime = new Date(`${counsellor.next_session_time}`);

//     // Compare session times and update next_session_time if needed
//     if (sessionDateTime > nextSessionDateTime) {
//       counsellor.next_session_time = sessionDateTime;
//     }
//     session.session_users.push(id);
//     session.session_available_slots--;

//     session.session_status = "Booked";

//     // Save the updated session and counselor data
//     await session.save();

//     counsellor.reward_points += 5;
//     await counsellor.save();

//     // Ensure session.session_date is a Date object
//     const bookingData = {
//       ...session._doc,
//       session_date: new Date(session.session_date),
//     };

//     try {
//       await axios.post(`${BACKEND_URL}/user/booking`, {
//         booked_by: id,
//         booked_entity: counsellor,
//         booking_type: "Counsellor",
//         booking_data: bookingData,
//       });
//     } catch (error) {
//       console.log(error.message);
//     }

//     // send email notification to user
//     if (user.email) {
//       await axios.post(`${BACKEND_URL}/notification/user/sessionbooked`, {
//         to: user.email,
//         date: session.session_date,
//         time: session.session_time,
//         counsellor: counsellor.name,
//         sessiontype: session.session_type,
//         duration: session.session_duration,
//         payment: session.session_fee,
//       });
//     }

//     // send email notification to counsellor
//     try {
//       await axios.post(`${BACKEND_URL}/notification/counsellor/sessionbooked`, {
//         to: counsellor.email,
//         date: session.session_date,
//         time: session.session_time,
//         client: user.name,
//         sessiontype: session.session_type,
//         duration: session.session_duration,
//         payment: session.session_fee,
//         username: counsellor.name,
//         session_topic: session.session_topic,
//         link: session.session_link,
//         subject: "New Counselling Session Booked",
//       });
//     } catch (err) {
//       console.log(err);
//     }

//     // send in app notification to counsellor
//     const response = await axios.post(`${BACKEND_URL}/notification/in-app`, {
//       user_id: counsellor._id,
//       title: "New Booking",
//       message: `${user.name} booked a ${session.session_type} session`,
//     });

//     // Respond with a success message
//     res.status(201).json({ message: "Counseling session booked successfully" });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Internal booking Server Error" });
//   }
// };

//=================! Book Session With Firebase Notifcataion !=============================================

exports.bookSession = async (req, res) => {
  try {
    const { phone_number, id } = req;
    const user = await User.findOne({ _id: id });

    const { session_id } = req.params;

    let session = await Session.findOne({ _id: session_id });

    const counsellor = await Counsellor.findOne({
      _id: session.session_counsellor,
    });

    const sessionDateTime = new Date(
      `${session.session_date} ${session.session_time}`
    );
    const nextSessionDateTime = new Date(`${counsellor.next_session_time}`);

    // Compare session times and update next_session_time if needed
    if (sessionDateTime > nextSessionDateTime) {
      counsellor.next_session_time = sessionDateTime;
    }
    session.session_users.push(id);
    session.session_available_slots--;

    session.session_status = "Booked";

    // Save the updated session and counselor data
    await session.save();

    counsellor.reward_points += 5;
    await counsellor.save();

    // Ensure session.session_date is a Date object
    const bookingData = {
      ...session._doc,
      session_date: new Date(session.session_date),
    };

    try {
      await axios.post(`${BACKEND_URL}/user/booking`, {
        booked_by: id,
        booked_entity: counsellor,
        booking_type: "Counsellor",
        booking_data: bookingData,
      });
    } catch (error) {
      console.log(error.message);
    }

    // Send email notification to user
    if (user.email) {
      await axios.post(`${BACKEND_URL}/notification/user/sessionbooked`, {
        to: user.email,
        date: session.session_date,
        time: session.session_time,
        counsellor: counsellor.name,
        sessiontype: session.session_type,
        duration: session.session_duration,
        payment: session.session_fee,
      });
    }

    // Send email notification to counsellor
    try {
      await axios.post(`${BACKEND_URL}/notification/counsellor/sessionbooked`, {
        to: counsellor.email,
        date: session.session_date,
        time: session.session_time,
        client: user.name,
        sessiontype: session.session_type,
        duration: session.session_duration,
        payment: session.session_fee,
        username: counsellor.name,
        session_topic: session.session_topic,
        link: session.session_link,
        subject: "New Counselling Session Booked",
      });
    } catch (err) {
      console.log(err);
    }

    // **Send Push Notification to User using FCM Token**

    if (user.fcm_token) {
      const sessionDate = new Date(session.session_date);

      // Format date as "Wed, Mar 05, 2025"
      const formattedDate = sessionDate.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "2-digit",
        year: "numeric",
      });

      // Convert `session.session_time` (minutes) to HH:MM AM/PM
      const hours = Math.floor(session.session_time / 60);
      const minutes = session.session_time % 60;
      const formattedTime = new Date(0, 0, 0, hours, minutes)
        .toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });

      const notificationData = {
        token: user.fcm_token, // **FCM token**
        title: "Session Booked Successfully!",
        body: `Your ${session.session_type} session with ${counsellor.name} on ${formattedDate} at ${formattedTime} is confirmed.`,
        type: "session_booking",
        id: session._id.toString(),
      };

      try {
        await axios.post(`${BACKEND_URL}/notification/send-notification-to-token`, notificationData);
      } catch (err) {
        console.log("FCM Notification Error:", err.message);
      }
    }

    // Respond with a success message
    res.status(201).json({ message: "Counseling session booked successfully", session_date: session.session_date });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal booking Server Error" });
  }
};



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
    //validation

    if (session_status === "Booked") {
      return res
        .status(200)
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

exports.getCheckoutDetails = async (req, res) => {
  try {
    const { session_id } = req.params;
    const session = await Session.findById(session_id);

    if (!session) {
      return res.status(404).json({ error: "Session not found" });
    }
    const counsellor_id = session.session_counsellor;
    const counsellorDetails = await Counsellor.findById(counsellor_id);
    if (!counsellorDetails) {
      return res.status(404).json({ error: "Counsellor not found" });
    }

    const sessionFee = session.session_fee;
    const gstAmount = 0.18 * sessionFee;
    const gatewayCharge = 0.05 * sessionFee;

    const totalAmount = sessionFee + gstAmount + gatewayCharge;

    const responseData = {
      session_id: session._id,
      sessionDate: session.session_date,
      sessionType: session.session_type,
      sessionFee: sessionFee,
      gstAmount: gstAmount,
      // feeWithGST: feeWithGST,
      gatewayCharge: gatewayCharge,
      totalAmount: totalAmount,
      counsellor_id: counsellorDetails._id,
      counsellor_name: counsellorDetails.name,
      counsellor_profile_pic: counsellorDetails.profile_pic,
    };
    console.log(responseData);

    return res.json([responseData]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


exports.getLatestSessions = async (req, res) => {
  try {
    // Get the current date and time in IST
    const currentDate = new Date();
    const istOffset = 5.5 * 60 * 60 * 1000; // IST offset in milliseconds
    const istDate = new Date(currentDate.getTime() + istOffset);

    // Normalize IST date to start of the day
    istDate.setUTCHours(0, 0, 0, 0);

    // Calculate the session time in minutes from IST
    const currentTimeInIST = new Date(currentDate.getTime() + istOffset);
    const sessionTime =
      currentTimeInIST.getHours() * 60 + currentTimeInIST.getMinutes();

    // Initialize sessions array
    let sessions = [];

    // Fetch sessions scheduled for today and in the future
    sessions.push(
      ...(await Session.find({
        session_date: { $eq: istDate },
        session_time: { $gte: sessionTime },
        session_type: "Group", // Filter to include only group sessions
      }))
    );

    // Fetch sessions scheduled from tomorrow onward
    const tomorrow = new Date(istDate);
    tomorrow.setDate(tomorrow.getDate() + 1);
    sessions.push(
      ...(await Session.find({
        session_date: { $gte: tomorrow },
        session_type: "Group", // Filter to include only group sessions
      }).sort({ session_date: 1, session_time: 1 }))
    );

    // Get the current time for session end comparison
    const currentTimeInMillis = Date.now() + istOffset;

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
      const massagedSessions = await Promise.all(
        sessions.map(async (session) => {
          // Calculate session start and end times in milliseconds
          const sessionStart = new Date(session.session_date);
          sessionStart.setMinutes(
            sessionStart.getMinutes() + session.session_time
          );
          const sessionEnd = new Date(
            sessionStart.getTime() + session.session_duration * 60 * 1000
          );

          // Skip the session if it has ended
          if (sessionEnd < currentTimeInMillis) {
            return null;
          }

          // Fetch the counsellor details and check if they are verified
          const counsellor = await Counsellor.findOne({
            _id: session.session_counsellor,
            verified: true, // Only include verified counsellors
          });

          if (!counsellor) {
            return null; // Skip session if counsellor is not verified
          }

          total_available_slots += session.session_available_slots;
          const sessionDate = new Date(session.session_date);
          let session_massaged_date = "";

          const today = new Date();
          const tomorrow = new Date(today);
          tomorrow.setDate(today.getDate() + 1);

          if (sessionDate.toDateString() === today.toDateString()) {
            session_massaged_date = "today";
          } else if (sessionDate.toDateString() === tomorrow.toDateString()) {
            session_massaged_date = "tomorrow";
          } else {
            const dayDiff = Math.ceil(
              (sessionDate - today) / (1000 * 3600 * 24)
            );
            if (dayDiff <= 7 && dayDiff > 0) {
              session_massaged_date = daysOfWeek[sessionDate.getDay()];
            } else {
              session_massaged_date = sessionDate.toDateString().slice(4); // Adjusted to slice(4) assuming you want to trim the day name.
              session.session_time = sessionTimeIntoString(
                session.session_time
              );
            }
          }

          // Adding session_starting_date
          const session_starting_date = sessionStart.toISOString();

          return {
            counsellor_id: counsellor._id,
            session_id: session._id,
            counsellor_profile_pic: counsellor.profile_pic,
            counsellor_name: counsellor.name,
            counsellor_designation: counsellor.designation,
            session_time: session.session_time,
            session_date: session_massaged_date,
            session_fee: session.session_fee,
            session_topic: session.session_topic,
            session_duration: session.session_duration,
            session_starting_date, // Newly added field
          };
        })
      );

      // Filter out any null values (i.e., sessions that have ended or unverified counsellors)
      const filteredSessions = massagedSessions.filter(
        (session) => session !== null
      );

      res.status(200).json(filteredSessions);
    } else {
      res.status(200).json([]);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};


exports.isSessionAboutToStart = async (req, res) => {
  try {
    const { session_id } = req.params;

    const session = await Session.findById(session_id);

    if (!session) {
      return res.status(404).json({ error: "Session not found" });
    }

    const sessionTimeMinutes = session.session_time; // Minutes from midnight (e.g., 14:00 -> 840 minutes)
    const sessionDuration = session.session_duration; // Duration in minutes
    const sessionDate = new Date(session.session_date); // Actual session date (YYYY-MM-DD)

    // ✅ Get current time in IST
    const currentTime = new Date();
    const currentTimeIST = new Date(
      currentTime.toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
    );

    // ✅ Convert sessionDate to IST
    const sessionDateIST = new Date(
      sessionDate.toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
    );

    // ✅ Set session start time using correct date and time
    const sessionStartTime = new Date(sessionDateIST);
    sessionStartTime.setHours(Math.floor(sessionTimeMinutes / 60));
    sessionStartTime.setMinutes(sessionTimeMinutes % 60);
    sessionStartTime.setSeconds(0);
    sessionStartTime.setMilliseconds(0);

    // ✅ Calculate session end time
    const sessionEndTime = new Date(sessionStartTime);
    sessionEndTime.setMinutes(sessionEndTime.getMinutes() + sessionDuration);

    // ✅ Define the threshold (10 minutes before session start)
    const thresholdBeforeStart = 10 * 60 * 1000; // 10 minutes in milliseconds
    const timeBeforeSessionStart = new Date(sessionStartTime - thresholdBeforeStart);

    // ✅ Ensure the session is for today
    const isSameDate =
      currentTimeIST.getFullYear() === sessionStartTime.getFullYear() &&
      currentTimeIST.getMonth() === sessionStartTime.getMonth() &&
      currentTimeIST.getDate() === sessionStartTime.getDate();

    // ✅ Final check: True only if session is starting in 10 min or ongoing
    const isAboutToStart =
      isSameDate && // ✅ Ensure today's date matches session date
      currentTimeIST >= timeBeforeSessionStart && // ✅ 10 min before session start
      currentTimeIST <= sessionEndTime; // ✅ Before session ends

    res.status(200).json({ isAboutToStart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};


//=============================! For local testing !=========================

// cron.schedule("* * * * *", async () => {
//   try {
//     const now = new Date();
//     const nowHours = now.getHours();
//     const nowMinutes = now.getMinutes();

//     // console.log(`🕒 Present Time: ${nowHours}:${nowMinutes}`);

//     const todayDate = new Date().toISOString().split("T")[0];
//     // console.log("Cron Job Started - Checking for sessions on:", todayDate);

//     const sessions = await Session.find({
//       session_date: todayDate,
//       session_status: "Booked",
//     });

//     console.log("Total sessions found for today:", sessions.length);

//     for (const session of sessions) {
//       // console.log("Processing session:", session._id);

//       const sessionTotalMinutes = session.session_time;
//       const nowTotalMinutes = nowHours * 60 + nowMinutes;
//       const diff = sessionTotalMinutes - nowTotalMinutes;
//       console.log(`⏳ Session starts in ${diff} minutes`);

//       if (diff === 10) {
//         // console.log("🚀 Session will start in 10 minutes:", session.session_topic);

//         const userIds = session.session_users;
//         // console.log("👥 Users to Notify:", userIds);

//         // Fetch FCM tokens
//         const tokenResponse = await axios.get(`${BACKEND_URL}/user/fcm-tokens`, {
//           params: {
//             user_ids: JSON.stringify(userIds)
//           }
//         });
//         const { fcmTokens } = tokenResponse.data;
//         console.log("📲 FCM Tokens Found:", fcmTokens);

//         if (fcmTokens.length > 0) {
//           // Send notification to multiple tokens using new endpoint
//           const notificationResponse = await axios.post(`${BACKEND_URL}/notification/send-notification-multiple`, {
//             tokens: fcmTokens,
//             title: "⚡ Your Session Starts Soon – Join Now!",
//             body: `Your session, "${session.session_topic}" starts in 10 minutes! Don't be late! 🚀`,
//             type: "session_booking",
//             id: session._id.toString()
//           });
//           console.log("Notification Response:", notificationResponse.data);
//         } else {
//           console.log("⚠️ No FCM tokens found, skipping notification");
//         }
//       }
//     }
//   } catch (error) {
//     console.error("❌ Error in cron job:", error);
//   }
// });



//=======================! Send Notification 10 minutes before the session starts !===================================

cron.schedule("*/10 * * * *", async () => {
  try {
    const now = new Date();

    // Convert UTC to IST by adding 5 hours 30 minutes
    const nowIST = new Date(now.getTime() + (5.5 * 60 * 60 * 1000));

    const nowHours = nowIST.getHours();
    const nowMinutes = nowIST.getMinutes();
    const nowTotalMinutes = nowHours * 60 + nowMinutes;

    console.log(`🕒 Current IST Time: ${nowHours}:${nowMinutes}`);

    const todayDate = nowIST.toISOString().split("T")[0]; // Today's date in IST

    const sessions = await Session.find({
      session_date: todayDate,
      session_status: "Booked",
    });

    console.log("Total sessions found for today:", sessions.length);

    for (const session of sessions) {
      const sessionTotalMinutes = session.session_time; // Ensure session_time is in minutes
      const diff = sessionTotalMinutes - nowTotalMinutes;

      console.log(`⏳ Session starts in ${diff} minutes`);

      if (diff === 10) {
        console.log("🚀 Session will start in 10 minutes:", session.session_topic);

        const userIds = session.session_users;

        // Fetch FCM tokens
        const tokenResponse = await axios.get(`${BACKEND_URL}/user/fcm-tokens`, {
          params: { user_ids: JSON.stringify(userIds) },
        });
        const { fcmTokens } = tokenResponse.data;

        console.log("📲 FCM Tokens Found:", fcmTokens);

        if (fcmTokens.length > 0) {
          // Send notification
          await axios.post(`${BACKEND_URL}/notification/send-notification-multiple`, {
            tokens: fcmTokens,
            title: "⚡ Your Session Starts Soon – Join Now!",
            body: `Your session ${session.session_topic} starts in 10 minutes! Don't be late! 🚀`,
            type: "session_booking",
            id: session._id.toString(),
          });
          console.log("✅ Notification sent successfully!");
        } else {
          console.log("⚠️ No FCM tokens found, skipping notification");
        }
      }
    }
  } catch (error) {
    console.error("❌ Error in cron job:", error);
  }
});

