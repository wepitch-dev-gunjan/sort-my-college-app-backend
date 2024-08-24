const { default: axios } = require("axios");
const Enquiry = require("../models/Enquiry");
const User = require("../../user/models/User");
const EntranceCourse = require("../models/EntranceCourse");
const { default: mongoose } = require("mongoose");
const { BACKEND_URL } = process.env;
const moment = require('moment');

// exports.addEnquiry = async (req, res) => {
//   try {
//     const { id } = req;
//     const { enquired_to, courses } = req.body;

//     // Check for required fields
//     if (!enquired_to) {
//       return res.status(400).send({
//         error: "required fields are not filled",
//       });
//     }

//     const currentDate = new Date();
//     const formattedDate = currentDate.toLocaleDateString("en-GB", {
//       day: "2-digit",
//       month: "2-digit",
//       year: "numeric",
//     });

//     // Create the new enquiry object
//     const newEnquiry = new Enquiry({
//       enquirer: id,
//       enquired_to,
//       courses: courses || [], // If courses are not provided, default to an empty array
//       date: formattedDate,
//     });

//     // Save the new enquiry
//     await newEnquiry.save();

//     // Respond with success message
//     res.status(201).json({
//       message: "Enquiry added successfully",
//       data: newEnquiry,
//     });
//   } catch (error) {
//     console.error("Error adding Enquiry:", error);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// };

// exports.addEnquiry = async (req, res) => {
//   try {
//     const { id } = req;
//     const { enquired_to, courses } = req.body;

//     // Check for required fields
//     if (!enquired_to) {
//       return res.status(400).send({
//         error: "required fields are not filled",
//       });
//     }

//     // Get the current date in IST (Indian Standard Time) without the time
//     const currentDate = new Date();
//     const indiaDate = new Intl.DateTimeFormat('en-GB', {
//       timeZone: 'Asia/Kolkata',
//       day: '2-digit',
//       month: '2-digit',
//       year: 'numeric',
//     }).format(currentDate);

//     // Create the new enquiry object
//     const newEnquiry = new Enquiry({
//       enquirer: id,
//       enquired_to,
//       courses: courses || [], // If courses are not provided, default to an empty array
//       date: indiaDate, // Only the date in dd/mm/yyyy format
//     });

//     // Save the new enquiry
//     await newEnquiry.save();

//     // Respond with success message
//     res.status(201).json({
//       message: "Enquiry added successfully",
//       data: newEnquiry,
//     });
//   } catch (error) {
//     console.error("Error adding Enquiry:", error);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// };

exports.addEnquiry = async (req, res) => {
  try {
    const { id } = req;
    const { enquired_to, courses } = req.body;

    // Check for required fields
    if (!enquired_to) {
      return res.status(400).send({
        error: "required fields are not filled",
      });
    }

    // Get the current date and time in IST (Indian Standard Time)
    const currentDate = new Date();
    const indiaDate = new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Asia/Kolkata',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(currentDate);

    // Check if the user has made an enquiry to the same institute in the last 24 hours
    const lastEnquiry = await Enquiry.findOne({
      enquirer: id,
      enquired_to,
    }).sort({ createdAt: -1 }); // Sort by most recent enquiry

    if (lastEnquiry) {
      const lastEnquiryTime = new Date(lastEnquiry.createdAt);
      const timeDifference = currentDate - lastEnquiryTime;
      const hoursDifference = timeDifference / (1000 * 60 * 60);

      if (hoursDifference < 24) {
        return res.status(403).json({
          message: `You can only make a new enquiry to this institute 24 hours after your last enquiry. Please try again later.`,
        });
      }
    }

    // Create the new enquiry object
    const newEnquiry = new Enquiry({
      enquirer: id,
      enquired_to,
      courses: courses || [], // If courses are not provided, default to an empty array
      date: indiaDate, // Only the date in dd/mm/yyyy format
    });

    // Save the new enquiry
    await newEnquiry.save();

    // Respond with success message
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

    // Validate institute_id
    if (!mongoose.Types.ObjectId.isValid(institute_id)) {
      return res.status(400).json({ message: "Invalid institute ID" });
    }

    const { status, startDate, endDate } = req.query;
    console.log("Start Date, End Date: ", startDate, endDate);
    let query = { enquired_to: institute_id };

    if (status) {
      query.status = status;
    }

    const enquiries = await Enquiry.find(query).sort({ createdAt: -1 });

    if (!enquiries || enquiries.length === 0) {
      return res.status(200).json([]);
    }

    // Filter by the custom date field
    const filteredEnquiries = enquiries.filter((enquiry) => {
      const enquiryDate = moment(enquiry.date, "DD/MM/YYYY, HH:mm:ss");

      let startMatch = true;
      let endMatch = true;

      if (startDate) {
        const start = moment(startDate, "YYYY-MM-DD").startOf('day');
        startMatch = enquiryDate.isSameOrAfter(start);
      }

      if (endDate) {
        const end = moment(endDate, "YYYY-MM-DD").endOf('day');
        endMatch = enquiryDate.isSameOrBefore(end);
      }

      return startMatch && endMatch;
    });

    const massagedDataPromise = Promise.all(
      filteredEnquiries.map(async (enquiry) => {
        try {
          const { data } = await axios.get(
            `${BACKEND_URL}/user/users-for-admin/${enquiry.enquirer.toString()}`
          );
          return {
            _id: enquiry._id,
            name: data.name,
            phone_number: data.phone_number,
            status: enquiry.status,
            date: enquiry.date, // Return the original `date` field
          };
        } catch (err) {
          console.error(
            `Error fetching user data for enquiry ${enquiry._id}:`,
            err
          );
          return {
            _id: enquiry._id,
            name: "N/A",
            phone_number: "N/A",
            status: enquiry.status,
            date: enquiry.date, // Return the original `date` field
          };
        }
      })
    );

    const massagedData = await massagedDataPromise;
    res.status(200).json(massagedData);
  } catch (error) {
    console.error("Error getting enquiries", error);
    res.status(500).json({ message: "Internal enquiries Server Error" });
  }
};

exports.getSingleEnquiry = async (req, res) => {
  try {
    const { enquiry_id } = req.params;

    // Validate enquiry_id
    if (!mongoose.Types.ObjectId.isValid(enquiry_id)) {
      return res.status(400).json({ message: "Invalid enquiry ID" });
    }

    const enquiryData = await Enquiry.findById(enquiry_id.toString());
    if (!enquiryData) {
      return res.status(404).send({ message: "No enquiry found with this ID" });
    }

    if (enquiryData.status === "Unseen") enquiryData.status = "Seen";
    await enquiryData.save();

    // Fetch user data
    let userData = { name: "N/A", phone_number: "N/A" };
    try {
      const userDataResponse = await axios.get(
        `${BACKEND_URL}/user/users-for-admin/${enquiryData.enquirer}`
      );
      userData = userDataResponse.data || userData;
    } catch (err) {
      console.error(`Error fetching user data for enquiry ${enquiry_id}:`, err);
    }

    // Fetch course data
    let courseData = { name: "N/A", type: "N/A" };
    if (mongoose.Types.ObjectId.isValid(enquiryData.courses.toString())) {
      try {
        const fetchedCourseData = await EntranceCourse.findById(enquiryData.courses.toString());
        courseData = fetchedCourseData || courseData;
      } catch (err) {
        console.error(`Error fetching course data for enquiry ${enquiry_id}:`, err);
      }
    }

    const responseData = {
      _id: enquiryData._id,
      enquirer: {
        _id: userData._id || "N/A",
        name: userData.name || "N/A",
        phone_number: userData.phone_number || "N/A",
      },
      course: {
        _id: courseData._id || "N/A",
        name: courseData.name || "N/A",
        type: courseData.type || "N/A",
      },
      message: enquiryData.message || "N/A",
      status: enquiryData.status || "N/A",
      date: enquiryData.createdAt ? enquiryData.createdAt.toISOString().split("T")[0] : "N/A", // Format date as YYYY-MM-DD
    };

    res.status(200).send(responseData);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send({ message: "Internal server error" });
  }
};

exports.EnquiryStatusChangeToReplies = async (req, res) => {
  try {
    const { enquiry_id } = req.params;

    const enquiryData = await Enquiry.findById(enquiry_id.toString());
    if (!enquiryData)
      return res.status(404).send({ message: "No enquiry found with this ID" });

    if (enquiryData.status === "Unseen")
      return res.status(400).send({
        error: "Enquiry is not seen",
      });

    if (enquiryData.status === "Seen") enquiryData.status = "Replied";
    await enquiryData.save();

    const userDataResponse = await axios.get(
      `${BACKEND_URL}/user/users-for-admin/${enquiryData.enquirer}`
    );
    const userData = userDataResponse.data;

    const courseData = await EntranceCourse.findById(enquiryData.courses);

    const responseData = {
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
    };

    res.status(200).send(responseData);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send({ message: "Internal server error" });
  }
};


// get Enqueries for Admin
// exports.getEnquiriesForAdmin = async (req, res) => {
//  try {
//   const {
//   search,
//   status,
//   } = req.query;
//   const queryObject = {};
//   if(status) {
//    queryObject.status = status;
//   }
//    const { institute_id } = req.params;
//    console.log("Institute: ", institute_id)
//    if (!institute_id) {
//      return res.status(404).json({ message: "Specified institute not found" });
//    }
//   //  const enquiries = await Enquiry.find({ enquired_to: institute_id, ...queryObject });
//    const enquiries = await Enquiry.find({ enquired_to: institute_id });

//    if (!enquiries) return res.status(201).send([]);
//    console.log("Enquirer: -> -> ", `${enquiry.enquirer.toString()}`)
//    const massagedDataPromise = Promise.all(
//      enquiries.map(async (enquiry) => {
//        const { data } = await axios.get(
//          `${BACKEND_URL}/user/users-for-admin/${enquiry.enquirer.toString()}`
//        );
//        return {
//          _id: enquiry._id,
//          name: data.name,
//          phone_number: data.phone_number,
//          status: enquiry.status,
//          date: enquiry.date,
//        };
//      })
//    );
  
//    massagedDataPromise
//      .then((massagedData) => {
//        // console.log(massagedData);
//        res.status(200).json(massagedData);
       
//      })
//      .catch((error) => {
//        console.error(error);
//      });
//    // console.log(massagedDataPromise);
//  } catch (error) {
//   console.log(error)
//    console.error("Error getting enquiries!!");
//    res.status(500).json({ message: "Internal  enquiries Server Error" });
//  }
// };


exports.getEnquiriesForAdmin = async (req, res) => {
  try {
    const { search, status, startDate, endDate } = req.query;
    const queryObject = {};

    // Handle status query
    if (status) {
      queryObject.status = status;
    }

    const { institute_id } = req.params;
    console.log("Institute: ", institute_id);

    if (!institute_id) {
      return res.status(404).json({ message: "Specified institute not found" });
    }
    if (startDate && endDate) {
      const start = new Date(startDate).toISOString();
      const endDateObject = new Date(endDate);
      endDateObject.setHours(23, 59, 59, 999); 
      const end = endDateObject.toISOString();
      queryObject.createdAt = {
        $gte: start,
        $lte: end,
      };
    }


    // Handle search query (example: searching in name field)
    if (search) {
      queryObject.name = { $regex: search, $options: 'i' };
    }

    // Query for enquiries
    const enquiries = await Enquiry.find({ enquired_to: institute_id, ...queryObject }).sort({ createdAt: -1 });

    if (!enquiries.length) return res.status(201).send([]);

    // Process enquiries to fetch user data
    const massagedDataPromise = Promise.all(
      enquiries.map(async (enquiry) => {
        try {
          const { data } = await axios.get(
            `${BACKEND_URL}/user/users-for-admin/${enquiry.enquirer.toString()}`
          );
          const createdAtTime = new Date(enquiry.createdAt).toLocaleTimeString();
          return {
            _id: enquiry._id,
            name: data.name,
            phone_number: data.phone_number,
            status: enquiry.status,
            date: enquiry.date,
            createdAt: createdAtTime,
          };
        } catch (error) {
          console.error(`Error fetching user data for enquiry ${enquiry._id}: `, error);
          return null; // Handle cases where user data fetch fails
        }
      })
    );

    massagedDataPromise
      .then((massagedData) => {
        // Filter out null results from failed fetches
        const filteredData = massagedData.filter(item => item !== null);
        res.status(200).json(filteredData);
      })
      .catch((error) => {
        console.error("Error processing enquiries: ", error);
        res.status(500).json({ message: "Internal server error while processing enquiries" });
      });
  } catch (error) {
    console.error("Error getting enquiries!!", error);
    res.status(500).json({ message: "Internal enquiries server error" });
  }
};


// getSingleEnquiryForAdmin

// exports.getSingleEnquiryForAdmin = async (req,res) => {
// try {
//  const { enquiry_id} =req.params;
//  const dataEnquiry = await Enquiry.findById(enquiry_id);

//  if(!dataEnquiry) 
//  return res.status(404).send({message : "No Enquiry Found"});
//  const getUserData = await axios.get(`${BACKEND_URL}/user/users-for-admin/${dataEnquiry.enquirer}`
//  );
//  const userData = getUserData.data
//  const courseData = await EntranceCourse.findById(dataEnquiry.courses.toString());
//  if(!courseData) {
//   return res.status(400).send("no Course Found")
//  }
//  const fetchData = {
//   id: dataEnquiry.id,
//   enquirer: {
// _id: userData._id,
// name: userData.name,
// phone_number: userData.phone_number,
//   },
//   course: {
//    _id: courseData._id,
//    name: courseData.name,
//    phone_number: courseData.phone_number
//   },
//   message: dataEnquiry.message,
//   status: dataEnquiry.status ,
//   date: dataEnquiry.date,
//  }
//  res.status(200).send(fetchData)
// } catch (error) {
//  console.log(error)
//  res.status(500).json({message : "Internal Server Error"});
// }
// }

exports.getSingleEnquiryForAdmin = async (req, res) => {
  try {
    const { enquiry_id } = req.params;

    // Validate enquiry_id
    if (!mongoose.Types.ObjectId.isValid(enquiry_id)) {
      return res.status(400).json({ message: "Invalid enquiry ID" });
    }

    const enquiryData = await Enquiry.findById(enquiry_id.toString());
    if (!enquiryData) {
      return res.status(404).send({ message: "No enquiry found with this ID" });
    }

    if (enquiryData.status === "Unseen") enquiryData.status = "Seen";
    await enquiryData.save();

    // Fetch user data
    let userData = { name: "N/A", phone_number: "N/A" };
    try {
      const userDataResponse = await axios.get(
        `${BACKEND_URL}/user/users-for-admin/${enquiryData.enquirer}`
      );
      userData = userDataResponse.data || userData;
    } catch (err) {
      console.error(`Error fetching user data for enquiry ${enquiry_id}:`, err);
    }

    // Fetch course data
    let courseData = { name: "N/A", type: "N/A" };
    if (mongoose.Types.ObjectId.isValid(enquiryData.courses.toString())) {
      try {
        const fetchedCourseData = await EntranceCourse.findById(
          enquiryData.courses.toString()
        );
        courseData = fetchedCourseData || courseData;
      } catch (err) {
        console.error(
          `Error fetching course data for enquiry ${enquiry_id}:`,
          err
        );
      }
    }

    const responseData = {
      _id: enquiryData._id,
      enquirer: {
        _id: userData._id || "N/A",
        name: userData.name || "N/A",
        phone_number: userData.phone_number || "N/A",
      },
      course: {
        _id: courseData._id || "N/A",
        name: courseData.name || "N/A",
        type: courseData.type || "N/A",
      },
      message: enquiryData.message || "N/A",
      status: enquiryData.status || "N/A",
      date: enquiryData.createdAt
        ? enquiryData.createdAt.toISOString().split("T")[0]
        : "N/A", // Format date as YYYY-MM-DD
    };

    res.status(200).send(responseData);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send({ message: "Internal server error" });
  }
};



// change status For Admin

exports.changeStatus = async (req, res) => {
 try {
   const { enquiry_id } = req.params;

   const enquiryData = await Enquiry.findById(enquiry_id.toString());
   if (!enquiryData)
     return res.status(404).send({ message: "No enquiry found with this ID" });

   if (enquiryData.status === "Unseen") {
     enquiryData.status = "Seen";
   } else if (enquiryData.status === "Seen") {
     enquiryData.status = enquiryData.status === "Replied" ? "Unseen" : "Replied";
   } else if (enquiryData.status === "Replied") {
     enquiryData.status = enquiryData.status === "Seen" ? "Unseen" : "Seen";
   }

   await enquiryData.save();

   const responseData = {
     status: enquiryData.status,
   };

   res.status(200).send(responseData);
 } catch (error) {
   console.error("Error:", error);
   res.status(500).send({ message: "Internal server error" });
 }
};

// exports.getAllEnquiriesForAdmin = async (req, res) => {
//  try {
//    const enquiries = await Enquiry.find(); 

//    if (!enquiries.length) {
//      return res.status(200).send([]);
//    }

//    const massagedDataPromise = Promise.all(
//      enquiries.map(async (enquiry) => {
//        try {
//          const { data } = await axios.get(
//            `${BACKEND_URL}/user/users-for-admin/${enquiry.enquirer.toString()}`
//          );
//          const createdAtTime = new Date(enquiry.createdAt).toLocaleTimeString();
//          return {
//            _id: enquiry._id,
//            name: data.name,
//            phone_number: data.phone_number,
//            status: enquiry.status,
//            date: enquiry.date,
//            createdAt: createdAtTime,
//          };
//        } catch (error) {
//          console.error(`Error fetching user details for enquiry ${enquiry._id}:`, error);
//          return null;
//        }
//      })
//    );

//    const massagedData = await massagedDataPromise;


//    const validData = massagedData.filter(item => item !== null);

//    res.status(200).json(validData);

//  } catch (error) {
//    console.error("Error getting enquiries:", error);
//    res.status(500).json({ message: "Internal Server Error" });
//  }
// };

// exports.getAllEnquiriesForAdmin = async (req, res) => {
//   try {
//     const { status, startDate, endDate } = req.query;

//     // Construct the query object
//     let query = {};
//     if (status) {
//       query.status = status;
//     }
//     if (startDate && endDate) {
//       const start = new Date(startDate).toISOString();
//       const endDateObject = new Date(endDate);
//       endDateObject.setHours(23, 59, 59, 999);
//       const end = endDateObject.toISOString();
//       query.createdAt = {
//         $gte: start,
//         $lte: end,
//       };
//     }

//     //const enquiries = await Enquiry.find(query);
//     const enquiries = await Enquiry.find(query).sort({ createdAt: -1 });

//     if (!enquiries.length) {
//       return res.status(200).send([]);
//     }

//     const massagedDataPromise = Promise.all(
//       enquiries.map(async (enquiry) => {
//         try {
//           const { data } = await axios.get(
//             `${BACKEND_URL}/user/users-for-admin/${enquiry.enquirer.toString()}`
//           );
//           const createdAtTime = new Date(
//             enquiry.createdAt
//           ).toLocaleTimeString();
//           return {
//             _id: enquiry._id,
//             name: data.name,
//             phone_number: data.phone_number,
//             status: enquiry.status,
//             date: enquiry.date,
//             createdAt: createdAtTime,
//           };
//         } catch (error) {
//           console.error(
//             `Error fetching user details for enquiry ${enquiry._id}:`,
//             error
//           );
//           return null;
//         }
//       })
//     );

//     const massagedData = await massagedDataPromise;
//     const validData = massagedData.filter((item) => item !== null);

//     res.status(200).json(validData);
//   } catch (error) {
//     console.error("Error getting enquiries:", error);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// };


exports.getAllEnquiriesForAdmin = async (req, res) => {
  try {
    const { status, startDate, endDate } = req.query;

    // Construct the query object
    let query = {};
    if (status) {
      query.status = status;
    }
    if (startDate && endDate) {
      const start = new Date(startDate).toISOString();
      const endDateObject = new Date(endDate);
      endDateObject.setHours(23, 59, 59, 999);
      const end = endDateObject.toISOString();
      query.createdAt = {
        $gte: start,
        $lte: end,
      };
    }

    // const enquiries = await Enquiry.find(query);
    const enquiries = await Enquiry.find(query).sort({ createdAt: -1 });

    if (!enquiries.length) {
      return res.status(200).send([]);
    }

    const massagedDataPromise = Promise.all(
      enquiries.map(async (enquiry) => {
        try {
          const { data } = await axios.get(
            `${BACKEND_URL}/user/users-for-admin/${enquiry.enquirer.toString()}`
          );

          // Convert createdAt to IST
          const createdAtDate = new Date(enquiry.createdAt);
          const offset = createdAtDate.getTimezoneOffset() * 60000; // offset in milliseconds
          const istTime = new Date(createdAtDate.getTime() + offset + 19800000); // IST offset is +5:30 from GMT
          const createdAtTime = istTime.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          });

          return {
            _id: enquiry._id,
            name: data.name,
            phone_number: data.phone_number,
            status: enquiry.status,
            date: enquiry.date,
            createdAt: createdAtTime,
          };
        } catch (error) {
          console.error(
            `Error fetching user details for enquiry ${enquiry._id}:`,
            error
          );
          return null;
        }
      })
    );

    const massagedData = await massagedDataPromise;
    const validData = massagedData.filter((item) => item !== null);

    res.status(200).json(validData);
  } catch (error) {
    console.error("Error getting enquiries:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
