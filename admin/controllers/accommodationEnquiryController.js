const AccommodationEnquiry = require("../models/AccommodationEnquiry");
const moment = require("moment");
const axios = require("axios");
const Accommodation = require("../models/Accommodation");
const { BACKEND_URL } = process.env;
const nodemailer = require("nodemailer");

// exports.addEnquiry = async (req, res) => {
//   try {
//     const { id } = req;
//     const { preferred_time, message, enquired_to } = req.body;

//     if (!enquired_to || !preferred_time || !preferred_time.length) {
//       return res.status(400).send({
//         error: "required fields are not filled",
//       });
//     }

//     const newEnquiry = new AccommodationEnquiry({
//       enquirer: id,
//       preferred_time,
//       enquired_to,

//     });

//     // Save the new enquiry
//     await newEnquiry.save();

//     res.status(201).json({
//       message: "Enquiry added successfully",
//       data: newEnquiry,
//     });
//   } catch (error) {
//     console.error("Error adding Enquiry:", error);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// };




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

exports.addEnquiry = async (req, res) => {
  try {
    const { id } = req;
    const { preferred_time, message, enquired_to } = req.body;

    // Check for required fields
    if (!enquired_to || !preferred_time || !preferred_time.length) {
      return res.status(400).send({
        error: "required fields are not filled",
      });
    }

    // Create the new enquiry object
    const newEnquiry = new AccommodationEnquiry({
      enquirer: id,
      preferred_time,
      enquired_to,
    });

    // Add message to the enquiry if it is provided
    if (message && message.length) {
      newEnquiry.message = message;
    }

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

exports.getAccommodationEnquiries = async (req, res) => {
  try {
    const {
      accommodation_id,
      status,
      fromDate,
      toDate,
      preferredFromDate,
      preferredToDate,
      accommodationName,
      search,
      phone, // New parameter for phone number filtering
    } = req.query;

    console.log("Preferred time range: ", preferredFromDate, preferredToDate);
    console.log("Phone: ", phone);

    // Initialize query object
    const query = {};

    // Apply accommodation_id filter if provided
    if (accommodation_id) {
      query.enquired_to = accommodation_id;
    }

    // Apply status filter if provided
    if (status) {
      query.enquiryStatus = status;
    }

    // Apply createdAt date range filter if provided
    if (fromDate || toDate) {
      query.createdAt = {};
      if (fromDate) query.createdAt.$gte = new Date(fromDate);
      if (toDate) query.createdAt.$lte = new Date(toDate);
    }

    if (preferredFromDate || preferredToDate) {
      query.preferred_time = {
        $elemMatch: {
          ...(isValidDate(preferredFromDate) && { $gte: new Date(preferredFromDate) }),
          ...(isValidDate(preferredToDate) && { $lte: new Date(preferredToDate) }),
        },
      };
    }
    
    

    
    

    // Apply accommodation name filter if provided
    if (accommodationName) {
      const accommodations = await Accommodation.find({
        name: { $regex: accommodationName, $options: "i" },
      }).select("_id");
      const accommodationIds = accommodations.map((acc) => acc._id);
      query.enquired_to = { $in: accommodationIds };
    }

    console.log("Final Query Object:", query);

    // Fetch enquiries based on query
    const enquiries = await AccommodationEnquiry.find(query)
      .populate("enquired_to", "name location")
      .exec();

    console.log("Enquiries: ", enquiries);

    // Fetch user details and filter by phone number
    const enrichedEnquiries = await Promise.all(
      enquiries.map(async (enquiry) => {
        try {
          const userResponse = await axios.get(
            `${BACKEND_URL}/user/users-for-admin/${enquiry.enquirer}`
          );

          const enquirerDetails = userResponse.data;

          // Filter by phone if provided
          if (phone && enquirerDetails.phone_number !== phone) {
            return null; // Skip this entry if phone does not match
          }

          return {
            ...enquiry._doc,
            enquirerDetails,
          };
        } catch (error) {
          console.error(`Error fetching user data for enquiry ${enquiry._id}:`, error);
          return { ...enquiry._doc, enquirerDetails: null };
        }
      })
    );

    // Filter out nulls (entries that did not match phone filter)
    const filteredEnquiries = enrichedEnquiries.filter(Boolean);

    // Apply search filter on the final result set
    if (search) {
      const searchLower = search.toLowerCase();
      filteredEnquiries = filteredEnquiries.filter((enquiry) => {
        const enquirerName = enquiry.enquirerDetails?.name?.toLowerCase() || "";
        const accommodationName = enquiry.enquired_to?.name?.toLowerCase() || "";
        const enquiryStatus = enquiry.enquiryStatus?.toLowerCase() || "";
        const preferredTime = enquiry.preferred_time?.[0]
          ? new Date(enquiry.preferred_time[0]).toLocaleString().toLowerCase()
          : "";
        const createdAt = new Date(enquiry.createdAt).toLocaleString().toLowerCase();

        return (
          enquirerName.includes(searchLower) ||
          accommodationName.includes(searchLower) ||
          enquiryStatus.includes(searchLower) ||
          preferredTime.includes(searchLower) ||
          createdAt.includes(searchLower)
        );
      });
    }

    res.status(200).json({
      message: "Enquiries fetched successfully",
      data: filteredEnquiries,
    });
  } catch (error) {
    console.error("Error fetching enquiries:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};







// exports.getAccommodationEnquiries = async (req, res) => {
//   try {
//     const { accommodation_id, status, fromDate, toDate, accommodationName, search } = req.query;
//     console.log("Accommodation name, search: ", accommodationName, search);
//     // Initialize query object
//     const query = {};

//     // Apply accommodation_id filter if provided
//     if (accommodation_id) {
//       query.enquired_to = accommodation_id;
//     }

//     // Apply status filter if provided
//     if (status) {
//       query.enquiryStatus = status;
//     }

//     // Apply date range filter if provided
//     if (fromDate || toDate) {
//       query.createdAt = {};
//       if (fromDate) query.createdAt.$gte = new Date(fromDate);
//       if (toDate) query.createdAt.$lte = new Date(toDate);
//     }

//     // Apply accommodation name filter if provided
//     if (accommodationName) {
//       const accommodations = await Accommodation.find({
//         name: { $regex: accommodationName, $options: "i" },
//       }).select("_id");
//       const accommodationIds = accommodations.map((acc) => acc._id);
//       query.enquired_to = { $in: accommodationIds };
//     }

//     // Fetch the enquiries based on the constructed query
//     const enquiries = await AccommodationEnquiry.find(query)
//       .populate("enquired_to", "name location") // populate fields from Accommodation model
//       .exec();

//     // Fetch user details for each enquiry
//     const enrichedEnquiries = await Promise.all(
//       enquiries.map(async (enquiry) => {
//         try {
//           const userResponse = await axios.get(
//             `${BACKEND_URL}/user/users-for-admin/${enquiry.enquirer}`
//           );
//           return {
//             ...enquiry._doc,
//             enquirerDetails: userResponse.data, // Add user details to each enquiry
//           };
//         } catch (error) {
//           console.error(`Error fetching user data for enquiry ${enquiry._id}:`, error);
//           return { ...enquiry._doc, enquirerDetails: null };
//         }
//       })
//     );

//     // Apply search filter on the final result set
//     let filteredEnquiries = enrichedEnquiries;
//     if (search) {
//       const searchLower = search.toLowerCase();
//       filteredEnquiries = enrichedEnquiries.filter((enquiry) => {
//         const enquirerName = enquiry.enquirerDetails?.name?.toLowerCase() || "";
//         const accommodationName = enquiry.enquired_to?.name?.toLowerCase() || "";
//         const enquiryStatus = enquiry.enquiryStatus?.toLowerCase() || "";
//         const preferredTime = enquiry.preferred_time?.[0]
//           ? new Date(enquiry.preferred_time[0]).toLocaleString().toLowerCase()
//           : "";
//         const createdAt = new Date(enquiry.createdAt).toLocaleString().toLowerCase();

//         return (
//           enquirerName.includes(searchLower) ||
//           accommodationName.includes(searchLower) ||
//           enquiryStatus.includes(searchLower) ||
//           preferredTime.includes(searchLower) ||
//           createdAt.includes(searchLower)
//         );
//       });
//     }

//     res.status(200).json({
//       message: "Enquiries fetched successfully",
//       data: filteredEnquiries,
//     });
//   } catch (error) {
//     console.error("Error fetching enquiries:", error);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// };

exports.sendEnquiryToOwner = async (req, res) => {
  try {
    const { enquiry_id, accommodation_id } = req.body;

    // Fetch the enquiry details
    const enquiry = await AccommodationEnquiry.findById(enquiry_id);
    if (!enquiry) {
      return res.status(404).json({ error: "Enquiry not found!" });
    }

    // Fetch the accommodation details
    const accommodation = await Accommodation.findById(accommodation_id);
    if (!accommodation || !accommodation.owner?.email) {
      return res.status(404).json({ error: "Accommodation or owner email not found!" });
    }

    // Prepare email content
    const emailContent = `
      <h2>New Enquiry for Your Accommodation</h2>
      <p><strong>Accommodation Name:</strong> ${accommodation.name}</p>
      <p><strong>Enquirer Name:</strong> ${enquiry.enquirerDetails?.full_name || "N/A"}</p>
      <p><strong>Enquiry Message:</strong> ${enquiry.message?.[0] || "No message"}</p>
      <p><strong>Preferred Time:</strong> ${enquiry.preferred_time?.[0] || "N/A"}</p>
    `;

    // Configure nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: "Gmail", // or another email service provider
      auth: {
        user: "sortmycollege.mail@gmail.com", // Replace with your email
        pass: "Sortmycollege@123!", // Replace with your email password
      },
    });

    // Send email
    await transporter.sendMail({
      from: "sortmycollege.mail@gmail.com",
      to: accommodation.owner.email,
      subject: "New Enquiry for Your Accommodation",
      html: emailContent,
    });

    res.status(200).json({ message: "Enquiry sent to owner's email successfully!" });
  } catch (error) {
    console.error("Error sending enquiry:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};




////////////////////////////////////////////////////////////////////////////////////////////////

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
