const { default: axios } = require("axios");
const Enquiry = require("../models/Enquiry");
const User = require("../../user/models/User");
const EntranceCourse = require("../models/EntranceCourse");
const { BACKEND_URL } = process.env;

// exports.addEnquiry = async (req, res) => {
//   try {
//     const { id } = req;
//     const { enquired_to, courses, mode, preferred_time, message } = req.body;

//     if (!enquired_to || !message)
//       return res.status(400).send({
//         error: "required fields are not filled",
//       });
//     const currentDate = new Date();

//     const formattedDate = currentDate.toLocaleDateString("en-GB", {
//       day: "2-digit",
//       month: "2-digit",
//       year: "numeric",
//     });

//     const newEnquiry = new Enquiry({
//       enquirer: id,
//       enquired_to,
//       courses,
//       mode,
//       preferred_time,
//       message,
//       date: formattedDate,
//     });

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

// get Engueries for Ep

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

    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

    // Create the new enquiry object
    const newEnquiry = new Enquiry({
      enquirer: id,
      enquired_to,
      courses: courses || [], // If courses are not provided, default to an empty array
      date: formattedDate,
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


// exports.getEnquiries = async (req, res) => {
//   try {
//     console.log("Reached")
//     const { institute_id } = req;
//     if (!institute_id) {
//       return res.status(404).json({ message: "Specified institute not found" });
//     }

//     const { date, status } = req.query;

//     const filter = { enquired_to: institute_id };
//     if (date) {
//       filter.date = date;
//     }
//     if (status) {
//       filter.status = status;
//     }

//     const enquiries = await Enquiry.find(filter);

//     // const enquiries = await Enquiry.find({ enquired_to: institute_id });
//     // console.log(enquiries);

//     if (!enquiries) return res.status(201).send([]);

//     const massagedDataPromise = Promise.all(
//       enquiries.map(async (enquiry) => {
//         const { data } = await axios.get(
//           `${BACKEND_URL}/user/users-for-admin/${enquiry.enquirer.toString()}`
//         );
//         console.log("dataa,", data);
//         return {
//           _id: enquiry._id,
//           name: data.name,
//           phone_number: data.phone_number,
//           status: enquiry.status,
//           date: enquiry.date,
//         };
//       })
//     );

//     massagedDataPromise
//       .then((massagedData) => {
//         // console.log(massagedData);
//         res.status(200).json(massagedData);
//       })
//       .catch((error) => {
//         console.error(error);
//       });

//     // console.log(massagedData);
//   } catch (error) {
//     console.error("Error getting enquiries");
//     res.status(500).json({ message: "Internal  enquiries Server Error" });
//   }
// };
// get Engueries for Ep
exports.getEnquiries = async (req, res) => {
  try {
    console.log("Reached")
    const { institute_id } = req;
    if (!institute_id) {
      return res.status(404).json({ message: "Specified institute not found" });
    }

    // const { date, status } = req.query;

    // const filter = { enquired_to: institute_id };
    // if (date) {
    //   filter.date = date;
    // }
    // if (status) {
    //   filter.status = status;
    // }
    // const enquiries = await Enquiry.find(filter);

  
    const { status, startDate, endDate } = req.query;
    let query = { enquired_to: institute_id };
    if (status) {
      query.status = status;
    }
    if (startDate && endDate) {
      const start = new Date(startDate).toISOString();
      const endDateObject = new Date(endDate);
      const timeZoneOffset = endDateObject.getTimezoneOffset() * 60000; // Timezone offset in milliseconds
      endDateObject.setHours(23, 59, 59, 999);
      const adjustedEndDate = new Date(
        endDateObject.getTime() - timeZoneOffset
      );
      const end = adjustedEndDate.toISOString();

      query.createdAt = {
        $gte: start,
        $lte: end,
      };
    }

    const enquiries = await Enquiry.find(query);

    // const enquiries = await Enquiry.find({ enquired_to: institute_id });
    // console.log(enquiries);

    if (!enquiries) return res.status(201).send([]);

    const massagedDataPromise = Promise.all(
      enquiries.map(async (enquiry) => {
        const { data } = await axios.get(
          `${BACKEND_URL}/user/users-for-admin/${enquiry.enquirer.toString()}`
        );
        console.log("dataa,", data);
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
    const enquiryData = await Enquiry.findById(enquiry_id.toString());
    if (!enquiryData)
      return res.status(404).send({ message: "No enquiry found with this ID" });

    if (enquiryData.status === "Unseen") enquiryData.status = "Seen";
    await enquiryData.save();

    const userDataResponse = await axios.get(
      `${BACKEND_URL}/user/users-for-admin/${enquiryData.enquirer}`
    );
    const userData = userDataResponse.data;
    
    const courseData = await EntranceCourse.findById(enquiryData.courses.toString());
    if(!courseData){
     return res.status(400).send("no course details found with this id ")
    }

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
    const enquiries = await Enquiry.find({ enquired_to: institute_id, ...queryObject });

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
exports.getSingleEnquiryForAdmin = async (req,res) => {
try {
 const { enquiry_id} =req.params;
 const dataEnquiry = await Enquiry.findById(enquiry_id);
 if(!dataEnquiry) 
 return res.status(404).send({message : "No Enquiry Found"});
 const getUserData = await axios.get(`${BACKEND_URL}/user/users-for-admin/${dataEnquiry.enquirer}`
 );
 const userData = getUserData.data
 const courseData = await EntranceCourse.findById(dataEnquiry.courses.toString());
 if(!courseData) {
  return res.status(400).send("no Course Found")
 }
 const fetchData = {
  id: dataEnquiry.id,
  enquirer: {
_id: userData._id,
name: userData.name,
phone_number: userData.phone_number,
  },
  course: {
   _id: courseData._id,
   name: courseData.name,
   phone_number: courseData.phone_number
  },
  message: dataEnquiry.message,
  status: dataEnquiry.status ,
  date: dataEnquiry.date,
 }
 res.status(200).send(fetchData)
} catch (error) {
 console.log(error)
 res.status(500).json({message : "Internal Server Error"});
}
}


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

    const enquiries = await Enquiry.find(query);

    if (!enquiries.length) {
      return res.status(200).send([]);
    }

    const massagedDataPromise = Promise.all(
      enquiries.map(async (enquiry) => {
        try {
          const { data } = await axios.get(
            `${BACKEND_URL}/user/users-for-admin/${enquiry.enquirer.toString()}`
          );
          const createdAtTime = new Date(
            enquiry.createdAt
          ).toLocaleTimeString();
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
