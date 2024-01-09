const Webinar = require("../models/Webinar");

exports.createWebinar = async (req, res) => {
  try {
    const { webinar_title, webinar_thumbnail, webinar_details, webinar_date, webinar_time, webinar_fee } = req.body;
    const { id } = req;
    if (!webinar_title || !webinar_details || !webinar_date || !webinar_time)
      return res.status(400).send({
        error: " All fields are required",
      });

    let webinar = new Webinar({
      webinar_host: id,
      webinar_title,
      webinar_thumbnail: webinar_thumbnail ? webinar_thumbnail : 'https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.freepik.com%2Fpremium-psd%2Fonline-live-webinar-youtube-thumbnail-banner-template_13485363.htm&psig=AOvVaw1mGtnGXdsAc0g5ljh95LaG&ust=1704800949482000&source=images&cd=vfe&opi=89978449&ved=0CBIQjRxqFwoTCPDkgMzczYMDFQAAAAAdAAAAABAD',
      webinar_details,
      webinar_date,
      webinar_time,
      webinar_fee: webinar_fee ? webinar_fee : 0,
    });

    webinar = await webinar.save();

    res.status(200).send({
      message: "Webinar successfully created",
      webinar,
    });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

exports.getWebinars = async (req, res) => {
  try {
    const {
      webinar_type,
      webinar_dates,
      webinar_duration,
      webinar_status,
      webinar_fee,
    } = req.query;
    console.log(webinar_type)
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

exports.getWebinarsForAdmin = async (req, res) => {
  try {
    const {
      search,
      webinar_dates,
      webinar_duration,
      webinar_fee, } = req.query;
    const { id } = req;

    const filter = { webinar_host: id };

    if (search) {
      filter.$or = [
        { webinar_title: { $regex: search, $options: 'i' } }, // Case-insensitive search for webinar title
        { webinar_details: { $regex: search, $options: 'i' } }, // Case-insensitive search for webinar title
      ];
    }

    if (webinar_dates && webinar_dates.length === 2) {
      const [startDate, endDate] = webinar_dates;

      filter.webinar_date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    if (webinar_fee) {
      filter.webinar_fee = {
        $gte: webinar_fee[0],
        $lte: webinar_fee[1],
      };
    }

    if (webinar_duration) {
      filter.webinar_duration = { $lte: webinar_duration };
    }

    let webinars = await Webinar.find(filter);

    res.status(200).send(webinars);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getWebinar = async (req, res) => {
  try {
    const { course_id } = req.params;

    const course = await Webinar.findById(course_id);
    if (!course) {
      return res.status(404).send({ error: "Course not found" });
    }

    res.status(200).send(course);
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

exports.deleteWebinar = async (req, res) => {
  try {
    const { course_id } = req.params;

    const course = await Webinar.findByIdAndDelete(course_id);
    if (!course) {
      return res.status(404).send({ error: "Course not found" });
    }

    res.status(200).send({ message: "Course Deleted Successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

exports.editWebinar = async (req, res) => {
  try {
    const { course_id } = req.params;
    const { course_name, course_degree, online, offline } = req.body;
    console.log(req.body);
    if (course_name || course_degree || online || offline) {
      let course = await Webinar.findById(course_id);
      if (!course) return res.status(404).send({ error: "Course not found" });

      const updateFields = {};
      if (course_name) {
        updateFields["course_name"] = course_name;
      }

      if (course_degree) {
        updateFields["course_degree"] = course_degree;
      }

      if (online) {
        updateFields["online"] = online;
      }

      if (offline) {
        updateFields["offline"] = offline;
      }

      course = await Webinar.findOne({ course_name });
      if (course)
        return res.status(400).send({ error: "Course name already exists" });

      const updatedCourse = await Webinar.findByIdAndUpdate(
        course_id,
        updateFields
      );

      if (!updatedCourse)
        return res.status(400).json({ error: "Course can't be updated" });

      res.status(200).json({ message: "Course updated successfully" });
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
