const {
  uploadImage,
} = require("../../entrance-preparation/services/cloudinary");

const Accommodation = require("../models/Accommodation");

exports.addAccommodation = async (req, res) => {
  try {
    const {
      type,
      name,
      address,
      direction,
      total_beds,
      recommended_for,
      owner,
      rooms,
      nearby_locations,
      rating,
      common_area_amenities,
      house_rules,
      gate_opening_time,
      gate_closing_time,
    } = req.body;

    console.log("Received body:", req.body);
    console.log("Received files:", req.files);

    // Parse address and nearby locations
    const parsedAddress = JSON.parse(address);
    const parsedNearbyLocations = JSON.parse(nearby_locations);

    // Parse rooms and house rules
    const parsedRooms = JSON.parse(rooms);
    const parsedHouseRules = Array.isArray(house_rules)
      ? house_rules
      : JSON.parse(house_rules);

    // Parse common area amenities
    const parsedCommonAreaAmenities = Array.isArray(common_area_amenities)
      ? common_area_amenities
      : JSON.parse(common_area_amenities);

    // Parse owner details
    const parsedOwner = {
      full_name: owner.full_name,
      dob: new Date(owner.dob),
      gender: owner.gender,
      contact_numbers: owner.contact_numbers,
      email: owner.email,
    };

    // Upload aadhar card if available
    let aadharCard = "";
    if (req.files && req.files.aadhar_card) {
      const file = req.files.aadhar_card[0];
      console.log("Uploading aadhar card:", file.originalname);
      const fileName = `aadhar-card-${Date.now()}.png`;
      const folderName = `aadhar_cards`;
      aadharCard = await uploadImage(file.buffer, fileName, folderName);
    }

    // Upload pan card if available
    let panCard = "";
    if (req.files && req.files.pan_card) {
      const file = req.files.pan_card[0];
      console.log("Uploading pan card:", file.originalname);
      const fileName = `pan-card-${Date.now()}.png`;
      const folderName = `pan_cards`;
      panCard = await uploadImage(file.buffer, fileName, folderName);
    }

    // Upload images array to cloudinary
    let images = [];
    if (req.files && req.files.images) {
      for (const file of req.files.images) {
        console.log("Uploading image:", file.originalname);
        const fileName = `acc-image-${Date.now()}.png`;
        const folderName = `accommodation_images`;
        const imagePath = await uploadImage(file.buffer, fileName, folderName);
        images.push(imagePath);
      }
    }

    // Construct new accommodation object
    const newAccommodation = new Accommodation({
      type,
      name,
      address: parsedAddress,
      direction,
      total_beds,
      recommended_for,
      owner: {
        ...parsedOwner,
        aadhar_card: aadharCard,
        pan_card: panCard,
      },
      rooms: parsedRooms,
      nearby_locations: parsedNearbyLocations,
      rating,
      common_area_amenities: parsedCommonAreaAmenities,
      house_rules: parsedHouseRules,
      gate_opening_time,
      gate_closing_time,
      images: images,
    });

    // Save new accommodation
    await newAccommodation.save();
    res
      .status(201)
      .send({ message: "Accommodation added successfully", newAccommodation });
  } catch (error) {
    console.error("Error adding accommodation:", error);
    res.status(500).json({ message: "Failed to add accommodation" });
  }
};

// exports.getAccommodationsForUser = async (req, res) => {
//   try {
//     // Fetch only required fields from the database
//     const accommodations = await Accommodation.find({}, {
//       address: 1,
//       images: { $arrayElemAt: ["$images", 0] }, // Only the first image
//       name: 1,
//       rooms: 1,
//       rating: 1,
//       _id: 1,
//     });

//     // Check if accommodations are found
//     if (!accommodations || accommodations.length === 0) {
//       return res.status(200).send([]);
//     }

//     // Transform the result to include only required fields
//     const response = accommodations.map((accommodation) => {
//       // Find the minimum monthly charge
//       const minMonthlyCharge = accommodation.rooms.reduce((min, room) => {
//         return room.monthly_charge < min ? room.monthly_charge : min;
//       }, Infinity);

//       return {
//         address: accommodation.address,
//         _id: accommodation._id,
//         images: accommodation.images, // Cloudinary image URL
//         name: accommodation.name,
//         monthly_charge: minMonthlyCharge || 0, // Minimum monthly charge
//         rating: accommodation.rating || 0,
//         review_count: 2, // Mock review count
//       };
//     });

//     return res.status(200).send(response);
//   } catch (error) {
//     console.log(error);
//     return res.status(500).send({ error: "Internal Server Error" });
//   }
// };

exports.getAccommodationsForAdmin = async (req, res) => {
  try {
    const accommodations = await Accommodation.find({});
    if (!accommodations || accommodations.length === 0) {
      return res.status(200).send([]);
    }
    console.log("here")
    return res.status(200).send(accommodations);
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error: "Internal Server Error" });
  }
};

exports.getAccommodationForAdmin = async (req, res) => {
  try {
    const { accomodation_id } = req.params;
    if (!accomodation_id) {
      return res.status(400).send({ error: "Accommodation ID is required" });
    }

    const accommodation = await Accommodation.findById(accomodation_id);
    // console.log(accommodation);
    if (!accommodation) {
      return res.status(404).send({ error: "Accommodation not found" });
    }

    return res.status(200).send(accommodation);
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error: "Internal Server Error" });
  }
};
exports.getAccommodationForUser = async (req, res) => {
  try {
    const { accomodation_id } = req.params;
    if (!accomodation_id) {
      return res.status(400).send({ error: "Accommodation ID is required" });
    }

    const accommodation = await Accommodation.findById(accomodation_id);
    // console.log(accommodation);
    if (!accommodation) {
      return res.status(404).send({ error: "Accommodation not found" });
    }

    return res.status(200).send(accommodation);
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error: "Internal Server Error" });
  }
};

exports.updateAccommodationStatus = async (req, res) => {
  try {
    const { accommodation_id } = req.params; // Get accommodation ID from the URL params
    const { status } = req.body; // Get the new status from the request body

    // Validate accommodation ID
    if (!accommodation_id) {
      return res.status(400).json({ error: "Accommodation ID is required" });
    }

    // Validate the new status
    const allowedStatuses = ["Pending", "Rejected", "Approved"];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ error: "Invalid status value" });
    }

    // Find the accommodation by ID and update the status
    const updatedAccommodation = await Accommodation.findByIdAndUpdate(
      accommodation_id,
      { status }, // Update the status field
      { new: true } // Return the updated document
    );

    // If accommodation is not found
    if (!updatedAccommodation) {
      return res.status(404).json({ error: "Accommodation not found" });
    }

    // Return the updated accommodation
    return res.status(200).json({
      message: "Status updated successfully",
      accommodation: updatedAccommodation,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.editAccommodation = async (req, res) => {
  try {
    const { accomodation_id } = req.params;
    const updates = req.body;



    if (!accomodation_id) {
      return res.status(400).send({ error: "Accommodation ID is required" });
    }
    // edit files
    if (req.files) {
      if (req.files.aadhar_card) {
        const file = req.files.aadhar_card[0];
        const fileName = `aadhar-card-${Date.now()}.png`;
        const folderName = `aadhar_cards`;
        updates['owner.aadhar_card'] = await uploadImage(file.buffer, fileName, folderName);
      }

      if (req.files.pan_card) {
        const file = req.files.pan_card[0];
        const fileName = `pan-card-${Date.now()}.png`;
        const folderName = `pan_cards`;
        updates['owner.pan_card'] = await uploadImage(file.buffer, fileName, folderName);
      }

      if (req.files.images) {
        let images = [];
        for (const file of req.files.images) {
          const fileName = `acc-image-${Date.now()}.png`;
          const folderName = `accommodation_images`;
          const imagePath = await uploadImage(file.buffer, fileName, folderName);
          images.push(imagePath);
        }
        updates.images = images;
      }
    }
    const updatedAccommodation = await Accommodation.findByIdAndUpdate(
      accomodation_id,
      updates,
      { new: true }
    );

    if (!updatedAccommodation) {
      return res.status(404).send({ error: "Accommodation not found" });
    }

    return res.status(200).send({
      message: "Accommodation updated successfully",
      data: updatedAccommodation,
    });
  } catch (error) {
    console.error("Error editing accommodation:", error);
    return res.status(500).send({ error: "Internal  Server Error" });
  }
};

exports.deleteAccommodation = async (req, res) => {
  const { accomodation_id } = req.params;

  const accommodation = await Accommodation.findByIdAndDelete(accomodation_id);
  if (!accommodation)
    return res
      .status(404)
      .send({ error: "No Accommodation Found With This ID" });
  return res
    .status(200)
    .send({ message: "Accommodation Deleted successfully" });
};


exports.getAccommodationsForUser = async (req, res) => {
  try {
    // Extract filters from the request query
    const { city, gender, occupancyType, minBudget, maxBudget, nearbyCollege } = req.body;
    const query = { status: "Approved" };

    // Apply city filter if provided (multi-select)
    if (city) {
      query["address.city"] = { $in: Array.isArray(city) ? city : [city] };
    }

    // Apply gender filter if provided (multi-select)
    if (gender) {
      query["recommended_for"] = { $in: Array.isArray(gender) ? gender : [gender] };
    }

    // Apply nearby college filter if provided (multi-select)
    if (nearbyCollege) {
      query["nearby_locations.colleges"] = { $in: Array.isArray(nearbyCollege) ? nearbyCollege : [nearbyCollege] };
    }

    // Apply filters on rooms
    if (occupancyType || minBudget || maxBudget) {
      query["rooms"] = {
        $elemMatch: {},
      };

      // Filter for occupancy type
      if (occupancyType) {
        query["rooms"].$elemMatch.sharing_type = { $in: Array.isArray(occupancyType) ? occupancyType : [occupancyType] };
      }

      // Filter for budget
      if (minBudget || maxBudget) {
        query["rooms"].$elemMatch.monthly_charge = {};
        if (minBudget) {
          query["rooms"].$elemMatch.monthly_charge.$gte = parseInt(minBudget);
        }
        if (maxBudget) {
          query["rooms"].$elemMatch.monthly_charge.$lte = parseInt(maxBudget);
        }
      }
    }

    // Fetch accommodations based on filters
    const accommodations = await Accommodation.find(query);

    // Transform accommodations to filter valid rooms and return required fields only
    const transformedAccommodations = accommodations.map((acc) => {
      // Filter valid rooms within the budget
      const validRooms = acc.rooms.filter((room) => {
        const isWithinBudget =
          (!minBudget || room.monthly_charge >= parseInt(minBudget)) &&
          (!maxBudget || room.monthly_charge <= parseInt(maxBudget));
        return isWithinBudget;
      });

      if (validRooms.length === 0) return null; // Skip accommodations with no valid rooms

      // Calculate the minimum monthly charge from valid rooms
      const minimumMonthlyCharge = Math.min(...validRooms.map((room) => room.monthly_charge));

      return {
        _id: acc._id,
        name: acc.name,
        address: {
          area: acc.address.area,
          city: acc.address.city,
        },
        images: acc.images[0], // Return first image only
        monthly_charge: minimumMonthlyCharge,
        rating: acc.rating.toString(),
        review_count: (acc.reviews_count || 0).toString(),
      };
    });

    // Remove null entries (accommodations with no valid rooms)
    const filteredAccommodations = transformedAccommodations.filter((item) => item !== null);

    if (filteredAccommodations.length === 0) {
      return res.status(200).send([]); // Return an empty array if no accommodations found
    }

    return res.status(200).send(filteredAccommodations);
  } catch (error) {
    console.error(error); // Log any errors that occur
    return res.status(500).send({ error: "Internal Server Error" }); // Return an error response
  }
};



// exports.getAccommodationsForUser = async (req, res) => {
//   try {
//     // Extract filters from the request query
//     const { city, gender, occupancyType, minBudget, maxBudget, nearbyCollege } = req.body;
//     // Create a query object
//     const query = { status: "Approved" };

//     // Apply city filter if provided (multi-select)
//     if (city) {
//       query["address.city"] = { $in: Array.isArray(city) ? city : [city] };
//     }

//     // Apply gender filter if provided (multi-select)
//     if (gender) {
//       query["recommended_for"] = { $in: Array.isArray(gender) ? gender : [gender] };
//     }

//     // Apply nearby college filter if provided (multi-select)
//     if (nearbyCollege) {
//       query["nearby_locations.colleges"] = { $in: Array.isArray(nearbyCollege) ? nearbyCollege : [nearbyCollege] };
//     }

//     // Apply filters on rooms
//     if (occupancyType || minBudget || maxBudget) {
//       query["rooms"] = {
//         $elemMatch: {},
//       };

//       // Filter for occupancy type
//       if (occupancyType) {
//         query["rooms"].$elemMatch.sharing_type = { $in: Array.isArray(occupancyType) ? occupancyType : [occupancyType] };
//       }

//       // Filter for budget
//       if (minBudget || maxBudget) {
//         query["rooms"].$elemMatch.monthly_charge = {};
//         if (minBudget) {
//           query["rooms"].$elemMatch.monthly_charge.$gte = parseInt(minBudget);
//         }
//         if (maxBudget) {
//           query["rooms"].$elemMatch.monthly_charge.$lte = parseInt(maxBudget);
//         }
//       }
//     }

//     // Fetch accommodations based on filters
//     const accommodations = await Accommodation.find(query);

//     // Transform accommodations to return required fields only
//     const transformedAccommodations = accommodations.map((acc) => {
//       const minimumMonthlyCharge = Math.min(...acc.rooms.map((room) => room.monthly_charge));
//       return {
//         _id: acc._id,
//         name: acc.name,
//         address: {
//           area: acc.address.area,
//           city: acc.address.city,
//         },
//         images: acc.images[0], // Return first image only
//         monthly_charge: minimumMonthlyCharge,
//         rating: acc.rating.toString(),
//         review_count: (acc.reviews_count || 0).toString(), // Assuming `reviews` is an array (if it exists)
//       };
//     });

//     // Check if accommodations are found
//     if (!transformedAccommodations || transformedAccommodations.length === 0) {
//       return res.status(200).send([]); // Return an empty array if no accommodations found
//     }

//     return res.status(200).send(transformedAccommodations); // Return the filtered accommodations
//   } catch (error) {
//     console.error(error); // Log any errors that occur
//     return res.status(500).send({ error: "Internal Server Error" }); // Return an error response
//   }
// };

// API to get unique city names for accommodations
exports.getCitiesForAccommodation = async (req, res) => {
  try {
    // Fetching all unique city names from the address field
    const cities = await Accommodation.distinct('address.city');

    // If cities are found, send them as response
    if (cities.length > 0) {
      res.status(200).json({ cities });
    } else {
      res.status(404).json({ message: "No cities found" });
    }
  } catch (error) {
    console.error("Error fetching cities:", error);
    res.status(500).json({ message: "Failed to fetch cities" });
  }
};

// exports.getNearbyCollegesForAccommodation = async (req, res) => {
//   try {
//     // Using aggregation to unwind the nearby_locations.colleges array and get distinct values
//     const colleges = await Accommodation.aggregate([
//       { $unwind: "$nearby_locations.colleges" }, // Unwind the colleges array
//       { $group: { _id: "$nearby_locations.colleges" } }, // Group by college name to get unique entries
//       { $project: { _id: 0, college: "$_id" } } // Format the response to return only the college names
//     ]);

//     // If colleges are found, send them as response
//     if (colleges.length > 0) {
//       res.status(200).json({ colleges: colleges.map(college => college.college) });
//     } else {
//       res.status(404).json({ message: "No nearby colleges found" });
//     }
//   } catch (error) {
//     console.error("Error fetching nearby colleges:", error);
//     res.status(500).json({ message: "Failed to fetch nearby colleges" });
//   }
// };




exports.getNearbyCollegesForAccommodation = async (req, res) => {
  try {
    const { city } = req.query;

    // Aggregation pipeline
    const pipeline = [];

    if (city) {
      pipeline.push({ $match: { "address.city": city } });
    }

    pipeline.push(
      { $unwind: "$nearby_locations.colleges" }, // Unwind the colleges array
      { $group: { _id: "$nearby_locations.colleges" } }, // Get distinct colleges
      { $project: { _id: 0, college: "$_id" } } // Format the output
    );

    const colleges = await Accommodation.aggregate(pipeline);

    if (colleges.length > 0) {
      res.status(200).json({ colleges: colleges.map(college => college.college) });
    } else {
      res.status(404).json({ message: city ? `No nearby colleges found in ${city}` : "No colleges found" });
    }
  } catch (error) {
    console.error("Error fetching nearby colleges:", error);
    res.status(500).json({ message: "Failed to fetch nearby colleges" });
  }
};

