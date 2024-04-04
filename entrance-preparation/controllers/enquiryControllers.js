const { default: axios } = require("axios");
const Enquiry = require("../models/Enquiry");
const { BACKEND_URL } = process.env;

exports.addEnquiry = async (req, res) => {
  try {
    const { id } = req;
    const { enquired_to, courses, mode, preferred_time, message } = req.body;

    if (!enquired_to || !message)
      return res.status(400).send({
        error: "required fields are not filled",
      });
    const currentDate = new Date();

    const newEnquiry = new Enquiry({
      enquirer: id,
      enquired_to,
      courses,
      mode,
      preferred_time,
      message,
      date: currentDate,
    });

    await newEnquiry.save();
    res.status(201).json({
      message: "Enquiry added successfully",
      data: newEnquiry,
    });
  } catch (error) {
    console.error("Error adding Enquiry:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.getEnquiries = async (req, res) => {
  try {
    const { institute_id } = req;
    if (!institute_id) {
      return res.status(404).json({ message: "Specified institute not found" });
    }
    const enquiries = await Enquiry.find({ enquired_to: institute_id });

    if (!enquiries) return res.status(201).send([]);

    const massagedData = enquiries.map(async (enquiry) => {
      console.log(enquiry.enquirer.toString());
      return;
      const { data } = await axios.get(
        `${BACKEND_URL}/user/users-for-admin/${enquiry.enquirer.toString()}`
      );
      return;
      return {
        _id: enquiry._id,
        name: data.name,
        phone_number: data.phone_number,
        status: enquiry.status,
        date: enquiry.date,
      };
    });
    res.status(201).send(massagedData);
  } catch (error) {
    console.error("Error getting enquiries");
    res.status(500).json({ message: "Internal Server Error" });
  }
};
