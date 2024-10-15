const AccommodationEnquiry = require("../models/AccommodationEnquiry");
const moment = require("moment");

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




// exports.getEnquiries = async (req, res) => {
//   try {
//     const { id } = req;
//     const { status, startDate, endDate, accommodationName } = req.query;
//     console.log("Name: ", accommodationName);
    

//     const query = { enquirer: id };

//     // Validate and apply filters based on provided parameters
//     if (status) {
//       query.enquiryStatus = status;
//     }

//     if (startDate && endDate) {
//       // Ensure the date includes time and is valid
//       if (
//         !moment(startDate, moment.ISO_8601).isValid() ||
//         !moment(endDate, moment.ISO_8601).isValid()
//       ) {
//         return res.status(400).json({
//           message: "Invalid date format. Please use a valid ISO 8601 date.",
//         });
//       }
//       query.createdAt = {
//         $gte: new Date(startDate), // Date object with time
//         $lte: new Date(endDate), // Date object with time
//       };
//     }

//     // Assuming accommodationName is a string and you want to match it with multiple accommodation names
//     if (accommodationName) {
//       const accommodationNames = accommodationName.split(","); // Split input string into array
//       const accommodationFilters = accommodationNames.map((name) => ({
//         "enquired_to.name": { $regex: name.trim(), $options: "i" },
//       }));

//       // Combine filters using $or to apply them
//       query.$or = accommodationFilters;
//     }

//     console.log("Final Query:", query);

//     const enquiries = await AccommodationEnquiry.find(query)
//       .populate("enquired_to", "name")
//       .select("createdAt preferred_time status enquiryStatus enquired_to");

//     const formattedEnquiries = enquiries.map((enquiry) => ({
//       id: enquiry._id,
//       accommodationName: enquiry.enquired_to.name,
//       createdAt: moment(enquiry.createdAt).format("YYYY-MM-DD HH:mm:ss"), // Include date and time
//       preferredDate: moment(enquiry.preferred_time).format(
//         "YYYY-MM-DD HH:mm:ss"
//       ), // Include date and time
//       status: enquiry.enquiryStatus,
//     }));

//     res.status(200).json({
//       message: "Enquiries retrieved successfully",
//       data: formattedEnquiries,
//     });
//   } catch (error) {
//     console.error("Error fetching enquiries:", error);
//     res.status(500).json({
//       message: "Error fetching enquiries",
//       error: error.message,
//     });
//   }
// };


exports.getEnquiries = async (req, res) => {
  try {
    const { id } = req;
    const { status, startDate, endDate, accommodationName } = req.query;
    console.log("Name: ", accommodationName);

    const query = { enquirer: id };

    // Validate and apply filters based on provided parameters
    if (status) {
      query.enquiryStatus = status;
    }

    if (startDate && endDate) {
      // Ensure the date includes time and is valid
      if (
        !moment(startDate, moment.ISO_8601).isValid() ||
        !moment(endDate, moment.ISO_8601).isValid()
      ) {
        return res.status(400).json({
          message: "Invalid date format. Please use a valid ISO 8601 date.",
        });
      }
      query.createdAt = {
        $gte: new Date(startDate), // Date object with time
        $lte: new Date(endDate), // Date object with time
      };
    }

    console.log("Final Query before fetching enquiries:", query);

    // Fetch enquiries based on the constructed query
    const enquiries = await AccommodationEnquiry.find(query)
      .populate("enquired_to", "name")
      .select("createdAt preferred_time status enquiryStatus enquired_to");

    // Format the retrieved enquiries
    const formattedEnquiries = enquiries.map((enquiry) => ({
      id: enquiry._id,
      accommodationName: enquiry.enquired_to.name,
      createdAt: moment(enquiry.createdAt).format("YYYY-MM-DD HH:mm:ss"), // Include date and time
      preferredDate: moment(enquiry.preferred_time).format(
        "YYYY-MM-DD HH:mm:ss"
      ), // Include date and time
      status: enquiry.enquiryStatus,
    }));

    // Apply accommodation name search after formatting
    if (accommodationName) {
      const accommodationNames = accommodationName
        .split(",")
        .map((name) => name.trim());
      // Filter formatted enquiries based on accommodation names
      const filteredEnquiries = formattedEnquiries.filter((enquiry) =>
        accommodationNames.some(
          (name) => enquiry.accommodationName.match(new RegExp(name, "i")) // Case-insensitive match
        )
      );

      if (filteredEnquiries.length === 0) {
        return res.status(200).json({
          message: "No enquiries found for the provided accommodation names.",
          data: [],
        });
      }

      // Set the response to the filtered enquiries
      res.status(200).json({
        message: "Enquiries retrieved successfully",
        data: filteredEnquiries,
      });
    } else {
      // If no accommodation names are provided, return all formatted enquiries
      res.status(200).json({
        message: "Enquiries retrieved successfully",
        data: formattedEnquiries,
      });
    }
  } catch (error) {
    console.error("Error fetching enquiries:", error);
    res.status(500).json({
      message: "Error fetching enquiries",
      error: error.message,
    });
  }
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
exports.getEnquiriesForAdmin = async (req, res) => {
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
