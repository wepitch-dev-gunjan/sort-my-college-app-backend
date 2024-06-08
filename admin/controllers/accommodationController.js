const {
  uploadImage,
} = require("../../entrance-preparation/services/cloudinary");
const Accommodation = require("../models/Accommodation");

// exports.addAccommodation = async (req, res) => {
//  try {
//    const {
//      type,
//      name,
//      address,
//      direction,
//      total_beds,
//      recommended_for,
//      owner,
//      rooms,
//      nearby_locations,
//      rating,
//      common_area_amenities,
//      house_rules,
//      gate_opening_time,
//      gate_closing_time,
//    } = req.body;

//    // Parse these fields back into objects
//    const parsedAddress = JSON.parse(address);
//    const parsedOwner = JSON.parse(owner);
//    const parsedNearbyLocations = JSON.parse(nearby_locations);
//    const parsedRooms = JSON.parse(rooms);
//    const parsedCommonAreaAmenities = Array.isArray(common_area_amenities)
//      ? common_area_amenities
//      : JSON.parse(common_area_amenities);

//      const parsedHouseRules = Array.isArray(house_rules)
//      ? house_rules
//      : JSON.parse(house_rules);

//    let images = [];
//    if (req.files && Array.isArray(req.files)) {
//      for (const file of req.files) {
//        console.log("Trynna upload image");
//        const fileName = `acc-image-${Date.now()}.png`;
//        const folderName = `accommodation_images`;
//        const imagePath = await uploadImage(file.buffer, fileName, folderName);
//        images.push(imagePath);
//      }
//    }

//    const newAccommodation = new Accommodation({
//      type,
//      images,
//      name,
//      address: parsedAddress,
//      direction,
//      total_beds,
//      recommended_for,
//      owner: parsedOwner,
//      rooms: parsedRooms,
//      nearby_locations: parsedNearbyLocations,
//      rating,
//      common_area_amenities: parsedCommonAreaAmenities,
//      house_rules :parsedHouseRules ,
//      gate_opening_time,
//      gate_closing_time,
//    });

//    await newAccommodation.save();
//    res
//      .status(201)
//      .send({ message: "Accommodation added successfully", newAccommodation });
//  } catch (error) {
//    console.error("Error adding accommodation:", error);
//    res.status(500).json({ message: "Failed to add accommodation" });
//  }
// };

// exports.addAccommodation = async (req, res) => {
//   try {
//     const {
//       type,
//       name,
//       address,
//       direction,
//       total_beds,
//       recommended_for,
//       owner,
//       rooms,
//       nearby_locations,
//       rating,
//       common_area_amenities,
//       house_rules,
//       gate_opening_time,
//       gate_closing_time,
//     } = req.body;

//     console.log("Received body:", req.body);
//     console.log("Received files:", req.files);

//     // Parse address and nearby locations
//     const parsedAddress = JSON.parse(address);
//     const parsedNearbyLocations = JSON.parse(nearby_locations);

//     // Parse rooms and house rules
//     const parsedRooms = JSON.parse(rooms);
//     const parsedHouseRules = Array.isArray(house_rules) ? house_rules : JSON.parse(house_rules);

//     // Parse common area amenities
//     const parsedCommonAreaAmenities = Array.isArray(common_area_amenities)
//       ? common_area_amenities
//       : JSON.parse(common_area_amenities);

//     // Parse owner details
//     const parsedOwner = {
//       full_name: owner.full_name,
//       dob: new Date(owner.dob),
//       gender: owner.gender,
//       contact_numbers: owner.contact_numbers,
//       email: owner.email,
//     };

//     // Upload aadhar card if available
//     let aadharCard = '';
//     if (req.files && req.files.aadhar_card) {
//       const file = req.files.aadhar_card[0];
//       console.log("Uploading aadhar card:", file.originalname);
//       const fileName = `aadhar-card-${Date.now()}.png`;
//       const folderName = `aadhar_cards`;
//       aadharCard = await uploadImage(file.buffer, fileName, folderName);
//     }

//     // Upload pan card if available
//     let panCard = '';
//     if (req.files && req.files.pan_card) {
//       const file = req.files.pan_card[0];
//       console.log("Uploading pan card:", file.originalname);
//       const fileName = `pan-card-${Date.now()}.png`;
//       const folderName = `pan_cards`;
//       panCard = await uploadImage(file.buffer, fileName, folderName);
//     }

//     // Construct new accommodation object
//     const newAccommodation = new Accommodation({
//       type,
//       name,
//       address: parsedAddress,
//       direction,
//       total_beds,
//       recommended_for,
//       owner: {
//         ...parsedOwner,
//         aadhar_card: aadharCard,
//         pan_card: panCard,
//       },
//       rooms: parsedRooms,
//       nearby_locations: parsedNearbyLocations,
//       rating,
//       common_area_amenities: parsedCommonAreaAmenities,
//       house_rules: parsedHouseRules,
//       gate_opening_time,
//       gate_closing_time,
//     });

//     // Save new accommodation
//     await newAccommodation.save();
//     res.status(201).send({ message: "Accommodation added successfully", newAccommodation });
//   } catch (error) {
//     console.error("Error adding accommodation:", error);
//     res.status(500).json({ message: "Failed to add accommodation" });
//   }
// };

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

exports.getAccommodations = async (req, res) => {
  try {
    const accommodations = await Accommodation.find({});

    if (!accommodations || accommodations.length === 0) {
      return res.status(200).send([]);
    }

    return res.status(200).send([accommodations]);
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error: "Internal Server Error" });
  }
};

exports.getAccommodation = async (req, res) => {
  try {
    const { accomodation_id } = req.params;

    if (!accomodation_id) {
      return res.status(400).send({ error: "Accommodation ID is required" });
    }

    const accommodation = await Accommodation.findById(accomodation_id);

    if (!accommodation) {
      return res.status(404).send({ error: "Accommodation not found" });
    }

    return res.status(200).send([accommodation]);
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error: "Internal Server Error" });
  }
};

exports.editAccommodation = async (req, res) => {
  try {
    const { accomodation_id } = req.params;
    const updates = req.body;

    if (!accomodation_id) {
      return res.status(400).send({ error: "Accommodation ID is required" });
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
