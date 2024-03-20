const { KJUR } = require("jsrsasign");
const { getZoomAccessToken } = require("../helpers/webinarHelpers");
const { default: axios } = require("axios");
const Webinar = require("../models/Webinar");
const uploadImage = require("../services/cloudinary");

require("dotenv").config();

exports.getWebinar = async (req, res) => {
  try {
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

exports.getWebinars = async (req, res) => {
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

    const webinar_image = await uploadImage(file.buffer);

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
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal Server Error" });
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
