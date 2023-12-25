const Webinar = require("../models/Webinar");

exports.createWebinar = async (req, res) => {
  try {
    const {
      webinar_host,
      webinar_image,
      webinar_title,
      webinar_details,
      webinar_date,
      webinar_time,
      webinar_duration,
      webinar_fee,
      webinar_status,
      webinar_slots,
      webinar_available_slots,
      webinar_link,
    } = req.body;

    if (
      !webinar_host ||
      !webinar_image ||
      !webinar_title ||
      !webinar_details ||
      !webinar_date ||
      !webinar_time ||
      !webinar_duration ||
      !webinar_fee ||
      !webinar_status ||
      !webinar_slots ||
      !webinar_available_slots ||
      !webinar_link
    )
      return res.status(400).send({
        error: " All fields are required",
      });

    const webinar = new Webinar({
      webinar_host,
      webinar_image,
      webinar_title,
      webinar_details,
      webinar_date,
      webinar_time,
      webinar_duration,
      webinar_fee,
      webinar_status,
      webinar_slots,
      webinar_available_slots,
      webinar_link,
    });

    webinar = await webinar.save();

    res.status(200).send({
      message: "Webinar created successfully",
      webinar,
    });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

exports.getWebinars = async (req, res) => {
  try {
    const {
      webinar_host,
      webinar_image,
      webinar_title,
      webinar_details,
      webinar_date,
      webinar_time,
      webinar_duration,
      webinar_fee,
      webinar_status,
      webinar_slots,
      webinar_available_slots,
      webinar_link,
    } = req.query;
    const filters = {};

    if (webinar_host) filters.webinar_host = webinar_host;
    if (webinar_image) filters.webinar_image = webinar_image;
    if (webinar_title) filters.webinar_title = webinar_title;
    if (webinar_details) filters.webinar_details = webinar_details;
    if (webinar_date) filters.webinar_date = webinar_date;
    if (webinar_time) filters.webinar_time = webinar_time;
    if (webinar_duration) filters.webinar_duration = webinar_duration;
    if (webinar_fee) filters.webinar_fee = webinar_fee;
    if (webinar_status) filters.webinar_status = webinar_status;
    if (webinar_slots) filters.webinar_slots = webinar_slots;
    if (webinar_available_slots)
      filters.webinar_available_slots = webinar_available_slots;
    if (webinar_link) filters.webinar_link = webinar_link;

    const webinars = await Webinar.find(filters);

    res.status(200).send(webinars);
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

exports.getWebinar = async (req, res) => {
  try {
    const { webinar_id } = req.params;

    const webinar = await Webinar.findById(webinar_id);
    if (!webinar) {
      return res.status(404).send({ error: "Webinar does not exist" });
    }

    res.status(200).send(webinar);
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

exports.deleteWebinar = async (req, res) => {
  try {
    const { webinar_id } = req.params;

    const webinar = await Webinar.findByIdAndDelete(webinar_id);
    if (!webinar) {
      return res.status(404).send({ error: "Webinar does not exist" });
    }

    res.status(200).send({ message: "Webinar Deleted Successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

exports.editWebinar = async (req, res) => {
  try {
    const { webinar_id } = req.params;
    const {
      webinar_host,
      webinar_image,
      webinar_title,
      webinar_details,
      webinar_date,
      webinar_time,
      webinar_duration,
      webinar_fee,
      webinar_status,
      webinar_slots,
      webinar_available_slots,
      webinar_link,
    } = req.body;
    console.log(req.body);
    if (
      webinar_host ||
      webinar_image ||
      webinar_title ||
      webinar_details ||
      webinar_date ||
      webinar_time ||
      webinar_duration ||
      webinar_fee ||
      webinar_status ||
      webinar_slots ||
      webinar_available_slots ||
      webinar_link
    ) {
      let webinar = await Webinar.findById(webinar_id);
      if (!webinar)
        return res.status(404).send({ error: "Webinar does not exist" });

      const updateFields = {};
      if (webinar_host) {
        updateFields["webinar_host"] = webinar_host;
      }

      if (webinar_image) {
        updateFields["webinar_image"] = webinar_image;
      }

      if (webinar_title) {
        updateFields["webinar_title"] = webinar_title;
      }

      if (webinar_details) {
        updateFields["webinar_details"] = webinar_details;
      }

      if (webinar_date) {
        updateFields["webinar_date"] = webinar_date;
      }

      if (webinar_time) {
        updateFields["webinar_time"] = webinar_time;
      }

      if (webinar_duration) {
        updateFields["webinar_duration"] = webinar_duration;
      }

      if (webinar_fee) {
        updateFields["webinar_fee"] = webinar_fee;
      }

      if (webinar_status) {
        updateFields["webinar_status"] = webinar_status;
      }

      if (webinar_slots) {
        updateFields["webinar_slots"] = webinar_slots;
      }

      if (webinar_available_slots) {
        updateFields["webinar_available_slots"] = webinar_available_slots;
      }

      if (webinar_link) {
        updateFields["webinar_link"] = webinar_link;
      }

      const updatedWebinar = await Webinar.findByIdAndUpdate(
        webinar_id,
        updateFields
      );

      if (!updatedWebinar)
        return res.status(400).json({ error: "Webinar can't be updated" });

      res.status(200).json({ message: "Webinar updated successfully" });
    } else {
      return res.status(400).send({
        error: "Atleast one field is required",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};
