const { default: axios } = require("axios");
const Enquiry = require("../models/Enquiry");
const User = require("../../user/models/User");
const EntranceCourse = require("../models/EntranceCourse");
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
    // console.log(enquiries);

    if (!enquiries) return res.status(201).send([]);

    const massagedDataPromise = Promise.all(
      enquiries.map(async (enquiry) => {
        const { data } = await axios.get(
          `${BACKEND_URL}/user/users-for-admin/${enquiry.enquirer.toString()}`
        );
        // console.log("dataa,", data);
        return {
          _id: enquiry._id,
          name: data.name,
          phone_number: data.phone_number,
          status: enquiry.status,
          date: enquiry.date,
        };
      })
    );

    massagedDataPromise
      .then((massagedData) => {
        // console.log(massagedData);
        res.status(200).json(massagedData);
      })
      .catch((error) => {
        console.error(error);
      });

    // console.log(massagedData);
  } catch (error) {
    console.error("Error getting enquiries");
    res.status(500).json({ message: "Internal  enquiries Server Error" });
  }
};
exports.getSingleEnquiry = async (req, res) => {
  try {
    const { enquiry_id } = req.params;
    console.log("yhi h bhai", enquiry_id);

    const enquiryData = await Enquiry.findById(enquiry_id.toString());

    if (!enquiryData)
      return res.status(404).send({ message: "No enquiry found with this ID" });

    const userDataResponse = await axios.get(
      `${BACKEND_URL}/user/users-for-admin/${enquiryData.enquirer}`
    );
    const userData = userDataResponse.data;

    const courseData = await EntranceCourse.findById(enquiryData.courses);

    const responseData = [
      {
        _id: enquiryData._id,
        enquirer: {
          _id: userData._id,
          name: userData.name,
          phone_number: userData.phone_number,
        },
        course: {
          _id: courseData._id,
          name: courseData.name,
          type: courseData.type,
        },
        message: enquiryData.message,
        status: enquiryData.status,
        date: enquiryData.date,
      },
    ];

    res.status(200).send(responseData);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send({ message: "Internal server error" });
  }
};
