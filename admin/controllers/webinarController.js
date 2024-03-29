const { KJUR } = require("jsrsasign");
const { getZoomAccessToken, webinarDateModifier, getDateDifference } = require("../helpers/webinarHelpers");
const { default: axios } = require("axios");
const Webinar = require("../models/Webinar");
const { uploadImage, deleteImage } = require("../services/cloudinary");

require("dotenv").config();

exports.getWebinarsForAdmin = async (req, res) => {
  try {
    const webinars = await Webinar.find();
    if (!webinars)
      return res.status(404).send({
        error: "Webinars not found",
      });

    res.status(200).send(webinars);
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

exports.getWebinarsForUser = async (req, res) => {
  try {
    const { user_id } = req;
    const { query } = req.query;

    const filter = {}

    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    const endOfDay = new Date(currentDate);
    endOfDay.setHours(23, 59, 59, 999);

    if (query === "Today") {
      filter.webinar_date = {
        $gte: currentDate,
        $lte: endOfDay
      }
    } else if (query === "Past") {
      filter.webinar_date = {
        $lt: currentDate
      }
    } else if (query === "Upcoming") {
      filter.webinar_date = {
        $gt: endOfDay
      }
    }

    const webinars = await Webinar.find(filter);
    if (!webinars) return res.status(200).send([]);

    const massagedWebinars = webinars.map(webinar => {
      const webinarDate = webinar.webinar_date;
      webinarDate.setUTCHours(0, 0, 0, 0);

      const currentDate = new Date();
      currentDate.setUTCHours(0, 0, 0, 0);

      const dateDifference = getDateDifference(webinarDate, currentDate)
      const webinar_date = webinarDateModifier(webinar.webinar_date);
      const registered = webinar.registered_participants.includes(user_id)
      return {
        id: webinar._id,
        webinar_image: webinar.webinar_image,
        webinar_title: webinar.webinar_title,
        webinar_date,
        registered_date: webinar.webinar_date,
        webinar_join_url: webinar.webinar_join_url,
        webinar_by: webinar.webinar_by,
        speaker_profile: webinar.speaker_profile,
        webinar_starting_in_days: dateDifference,
        registered
      }
    })

    res.status(200).send(massagedWebinars)
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: 'Internal Server Error' });
  }
};

exports.addWebinar = async (req, res) => {
  try {
    const {
      webinar_title,
      webinar_by,
      webinar_details,
      what_will_you_learn,
      webinar_date,
      webinar_time,
      speaker_profile,
      webinar_total_slots,
    } = req.body;
    const { file } = req;

    if (!file)
      return res.status(404).send({
        error: "Image file is required",
      });

    if (!webinar_title)
      return res.status(400).send({
        error: "Title is required",
      });
    if (!webinar_date)
      return res.status(400).send({
        error: "Date is required",
      });
    if (!webinar_by)
      return res.status(400).send({
        error: "Webinar host is required",
      });

    const [year, month, day] = webinar_date.split("-"); // Split webinar_date into year, month, and day
    const [hours, minutes] = webinar_time.split(":"); // Split webinar_time into hours and minutes

    const combinedDateTime = new Date(
      Date.UTC(year, month - 1, day, hours, minutes)
    );

    // Make a POST request to Zoom API to create a meeting
    const { data } = await axios.post(
      `https://api.zoom.us/v2/users/me/meetings`,
      {
        topic: webinar_title, // Use webinar_title as the topic
        type: 2, // Scheduled meeting
        start_time: combinedDateTime.toISOString(), // Start time of the meeting
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${await getZoomAccessToken()}`, // Get Zoom access token
        },
      }
    );
    const fileName = `webinar-image-${Date.now()}.jpeg`;
    const folderName = "webinar-images";


    const webinar_image = await uploadImage(file.buffer, fileName, folderName);

    // Create a new instance of the Webinar model
    const webinar = new Webinar({
      webinar_title,
      webinar_details,
      what_will_you_learn,
      webinar_date: combinedDateTime,
      speaker_profile,
      webinar_by,
      webinar_image,
      webinar_total_slots,
      webinar_start_url: data.start_url,
      webinar_join_url: data.join_url,
      webinar_password: data.password,
      registered_participants: [],
      attended_participants: [],
    });

    // Save the webinar to the database
    await webinar.save();

    // Respond with the created webinar data
    res.status(200).send(webinar);
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

exports.editWebinar = async (req, res) => {
  try {
    const { webinat_id, cloudinary_image_id } = req.body;
    if (!webinat_id) {
      return res.status(404).send({
        error: "Webinar Not Found",
      });
    }
    if (cloudinary_image_id) {
      await cloudinary.uploader.destroy(cloudinary_image_id);
    }
    await Webinar.findByIdAndDelete(webinat_id);
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

exports.deleteWebinar = async (req, res) => {
  try {
    const { cloudinary_image_id } = req.body;
    const { webinar_id } = req.params;

    if (!webinar_id) {
      return res.status(404).send({
        error: "Webinar not found!!"
      });
    }
    if (cloudinary_image_id) {
      await deleteImage(cloudinary_image_id);
    }
    await Webinar.findByIdAndDelete(webinar_id);

    res.status(200).send({
      message: "Webinar Deleted Successfully"
    })
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal Serverr Error" });
  }
};

exports.zoomGenerateSignature = (req, res) => {
  try {
    const { meeting_number, role, user_name } = req.body;
    const iat = Math.round(new Date().getTime() / 1000) - 30;
    const exp = iat + 60 * 60 * 2;

    const { ZOOM_CLIENT_ID, ZOOM_CLIENT_SECRET } = process.env;

    const oHeader = { alg: "HS256", typ: "JWT" };

    const oPayload = {
      sdkKey: ZOOM_CLIENT_ID,
      mn: meeting_number,
      role,
      iat: iat,
      exp: exp,
      appKey: ZOOM_CLIENT_ID,
      tokenExp: iat + 60 * 60 * 2,
    };

    const sHeader = JSON.stringify(oHeader);
    const sPayload = JSON.stringify(oPayload);
    const signature = KJUR.jws.JWS.sign(
      "HS256",
      sHeader,
      sPayload,
      ZOOM_CLIENT_SECRET
    );
    res.status(200).send({
      signature,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

exports.getSingleWebinarForAdmin = async (req, res) => {
  const { webinar_id } = req.params;
  try {
    const webinar = await Webinar.findOne({ _id: webinar_id });
    if (!webinar) {
      return res.status(404).json({ error: "No webinar found with this ID" });
    }

    res.status(200).send(webinar);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getSingleWebinarForUser = async (req, res) => {
  const { webinar_id } = req.params;
  const { user_id } = req;
  try {
    const webinar = await Webinar.findOne({ _id: webinar_id });
    if (!webinar) {
      return res.status(404).json({ error: "No webinar found with this ID" });
    }
    const webinarDate = webinar.webinar_date;
    webinarDate.setUTCHours(0, 0, 0, 0);

    const currentDate = new Date();
    currentDate.setUTCHours(0, 0, 0, 0);

    const dateDifference = getDateDifference(webinarDate, currentDate)

    const registered = webinar.registered_participants.includes(user_id)

    const massagedWebinar = {
      _id: webinar._id,
      webinar_title: webinar.webinar_title,
      webinar_details: webinar.webinar_details,
      what_will_you_learn: webinar.what_will_you_learn,
      webinar_date: webinar.webinar_date,
      speaker_profile: webinar.speaker_profile,
      webinar_by: webinar.webinar_by,
      webinar_image: webinar.webinar_image,
      webinar_join_url: webinar.webinar_join_url,
      webinar_password: webinar.webinar_password,
      webinar_total_slots: webinar.webinar_total_slots,
      registered_participants: webinar.registered_participants,
      attended_participants: webinar.attended_participants,
      webinar_starting_in_day: dateDifference,
      registered
    };

    res.status(200).send(massagedWebinar);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.registerParticipant = async (req, res) => {
  try {
    const { webinar_id } = req.params;
    const { user_id } = req;

    const webinar = await Webinar.findOne({ _id: webinar_id })
    if (!webinar) return res.status(404).send({
      error: "Webinar not found"
    })
    const webinarDate = webinar.webinar_date;
    webinarDate.setUTCHours(0, 0, 0, 0);

    const currentDate = new Date();
    currentDate.setUTCHours(0, 0, 0, 0);

    const dateDifference = getDateDifference(webinarDate, currentDate)

    if (webinar.registered_participants.includes(user_id)) return res.status(400).send({
      error: "Participant is already registered"
    })

    webinar.registered_participants.push(user_id);
    await webinar.save();

    res.status(200).send({
      message: "Registration completed",
      webinar_starting_in_days: dateDifference
    })
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: 'Internal Server Error' });
  }
};

exports.removeParticipant = async (req, res) => {
  try {
    const { webinar_id } = req.params;
    const { user_id } = req;

    const webinar = await Webinar.findOne({ _id: webinar_id });
    if (!webinar) return res.status(404).send({ error: "Webinar not found" });

    // Check if the user is registered as a participant
    const participantIndex = webinar.registered_participants.indexOf(user_id);
    if (participantIndex === -1) {
      return res.status(400).send({ error: "Participant is not registered" });
    }

    // Remove the participant from the registered_participants array
    webinar.registered_participants.splice(participantIndex, 1);
    await webinar.save();

    res.status(200).send({ message: "Participant removed successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'Internal Server Error' });
  }
};


