const AccommodationEnquiry = require("../models/AccommodationEnquiry");

exports.addEnquiry = async (req, res) => {
  try {
    const { id } = req;
    const { preferred_time, enquired_to } = req.body;

    if (!enquired_to || !preferred_time || !preferred_time.length) {
      return res.status(400).send({
        error: "required fields are not filled",
      });
    }

    const newEnquiry = new AccommodationEnquiry({
      enquirer: id,
      preferred_time,
      enquired_to,
      enquiryStatus,
    });

    // Save the new enquiry
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
    const { accommodation_id } = req;
    if (!accommodation_id) {
      return res
        .status(404)
        .json({ message: "Specified accommodation not found" });
    }
    const enquiries = AccommodationEnquiry.findById({
      enquired_to: accommodation_id,
    });
    if (!enquiries) return res.status(201).send([]);
    const massagedDataPromise = Promise.all(
      enquiries.map(async (enquiry) => {
        const { data } = await axios.get(
          `${BACKEND_URL}/user/users-for-admin/${enquiry.enquirer.toString()}`
        );
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
        res.status(200).json(massagedData);
      })
      .catch((error) => {
        console.error(error);
      });
    res.staus(201).send(enquiries);
  } catch (error) {}
};

exports.deleteEnquiryForAdmin = async (req, res) => {
  try {
    const { enquiryId } = req.params;

    if (!enquiryId) {
      return res.status(400).json({ message: "Enquiry ID is required" });
    }

    const deletedEnquiry = await AccommodationEnquiry.findByIdAndDelete(
      enquiryId
    );

    if (!deletedEnquiry) {
      return res.status(404).json({ message: "Enquiry not found" });
    }

    res.status(200).json({
      message: "Enquiry deleted successfully",
      data: deletedEnquiry,
    });
  } catch (error) {
    console.error("Error deleting Enquiry:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
exports.getEnquiriesForAAdmin = async (req, res) => {
  try {
    const { accommodation_id } = req.query;

    if (!accommodation_id) {
      return res.status(400).json({ message: "Accommodation ID is required" });
    }

    const enquiries = await AccommodationEnquiry.find({
      enquired_to: accommodation_id,
    });

    if (!enquiries) {
      return res.status(404).json([]);
    }

    const massagedDataPromise = Promise.all(
      enquiries.map(async (enquiry) => {
        const { data } = await axios.get(
          `${BACKEND_URL}/user/users-for-admin/${enquiry.enquirer.toString()}`
        );
        return {
          _id: enquiry._id,
          name: data.name,
          phone_number: data.phone_number,
          status: enquiry.enquiryStatus, // Assuming `enquiryStatus` is the correct field name
          date: enquiry.createdAt, // Assuming `createdAt` is the correct field name
        };
      })
    );

    massagedDataPromise
      .then((massagedData) => {
        res.status(200).json(massagedData);
      })
      .catch((error) => {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
      });
  } catch (error) {
    console.error("Error getting enquiries:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getEnquiryForAdmin = async (req, res) => {
  try {
    const { enquiryId } = req.params;

    const enquiry = await AccommodationEnquiry.findById(enquiryId);

    if (!enquiry) {
      return res.status(404).json({ message: "Enquiry not found" });
    }

    const { data } = await axios.get(
      `${BACKEND_URL}/user/users-for-admin/${enquiry.enquirer.toString()}`
    );

    const massagedData = {
      _id: enquiry._id,
      name: data.name,
      phone_number: data.phone_number,
      status: enquiry.enquiryStatus, // Assuming `enquiryStatus` is the correct field name
      date: enquiry.createdAt, // Assuming `createdAt` is the correct field name
    };

    res.status(200).json(massagedData);
  } catch (error) {
    console.error("Error getting enquiry:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
exports.getEnquiryForUser = async (req, res) => {
  try {
    const { enquiryId } = req.params;

    const enquiry = await AccommodationEnquiry.findById(enquiryId);

    if (!enquiry) {
      return res.status(404).json({ message: "Enquiry not found" });
    }

    // Check if the user requesting the enquiry is the enquirer
    if (enquiry.enquirer.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "You are not authorized to view this enquiry" });
    }

    res.status(200).json(enquiry);
  } catch (error) {
    console.error("Error getting enquiry:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
