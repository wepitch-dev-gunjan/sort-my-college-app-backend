const express = require("express");
const Accommodation = require("../models/Accommodation");
const router = express.Router();

exports.accommodationRegister = async (req, res) => {
  try {
    const {
      type,
      images,
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
      gate_opning_time,
      gate_closing_time,
    } = req.body;

    // Validation
    if (!type || !["PG", "Hostel"].includes(type)) {
      return res
        .status(400)
        .send({ error: "Invalid or missing accommodation type" });
    }
    if (!images || images.length === 0) {
      return res.status(400).send({ error: "Images  not be empty" });
    }
    if (!name) {
      return res.status(400).send({ error: "Name cannot be empty" });
    }
    if (
      !address ||
      !address.area ||
      !address.city ||
      !address.state ||
      !address.pin_code
    ) {
      return res.status(400).send({ error: "Address fields cannot be empty" });
    }
    if (!direction) {
      return res.status(400).send({ error: "Direction cannot be empty" });
    }
    if (!total_beds) {
      return res.status(400).send({ error: "Total beds cannot be empty" });
    }
    if (
      !recommended_for ||
      !["Boys", "Girls", "Both"].includes(recommended_for)
    ) {
      return res
        .status(400)
        .send({ error: "Invalid or missing recommended for field" });
    }
    if (
      !owner ||
      !owner.full_name ||
      !owner.dob ||
      !owner.gender ||
      !owner.contact_numbers ||
      !owner.email ||
      !owner.adhar_card ||
      !owner.pan_card
    ) {
      return res.status(400).send({ error: "Owner fields cannot be empty" });
    }
    if (!rooms || rooms.length === 0) {
      return res.status(400).send({ error: "Rooms array must not be empty" });
    }
    rooms.forEach((room) => {
      if (
        !room.sharing_type ||
        !["Single", "Double", "Triple"].includes(room.sharing_type)
      ) {
        return res
          .status(400)
          .send({ error: "Invalid or missing sharing type for rooms" });
      }
      if (room.available === undefined) {
        return res
          .status(400)
          .send({ error: "Availability must be specified for each room" });
      }
      if (!room.deposit_amount) {
        return res
          .status(400)
          .send({ error: "Deposit amount cannot be empty for rooms" });
      }
      if (!room.monthly_charge) {
        return res
          .status(400)
          .send({ error: "Monthly charge cannot be empty for rooms" });
      }
      if (!room.notice_period) {
        return res
          .status(400)
          .send({ error: "Notice period cannot be empty for rooms" });
      }
      if (!room.details || room.details.length === 0) {
        return res
          .status(400)
          .send({ error: "Details must be provided for each room" });
      }
    });

    if (
      !nearby_locations ||
      Object.values(nearby_locations).some(
        (arr) => !Array.isArray(arr) || arr.length === 0
      )
    ) {
      return res.status(400).send({
        error:
          "Nearby locations must be provided and should not be empty arrays",
      });
    }

    if (!rating || typeof rating !== "number") {
      return res.status(400).send({ error: "Rating must be a number" });
    }

    if (
      !common_area_amenities ||
      !Array.isArray(common_area_amenities) ||
      common_area_amenities.length === 0
    ) {
      return res.status(400).send({
        error:
          "Common area amenities must be provided and should not be an empty array",
      });
    }

    if (
      !house_rules ||
      !Array.isArray(house_rules) ||
      house_rules.length === 0
    ) {
      return res.status(400).send({
        error: "House rules must be provided and should not be an empty array",
      });
    }

    if (!gate_opning_time || !gate_closing_time) {
      return res
        .status(400)
        .send({ error: "Gate opening and closing time must be provided" });
    }

    const newUser = new Accommodation({
      type,
      images,
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
      gate_opning_time,
      gate_closing_time,
    });

    await newUser.save();

    res.status(201).send({ message: "User registered successfully", newUser });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ message: "Failed to register user" });
  }
};
exports.getaccommodations = async (req, res) => {
  try {
    const accommodations = await Accommodation.find({});

    if (!accommodations || accommodations.length === 0) {
      return res.status(200).send({ data: [] });
    }

    return res.status(200).send({ data: accommodations });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error: "Internal Server Error" });
  }
};

exports.getSingleAccommodation = async (req, res) => {
  try {
    const { accommodationId } = req.params;

    if (!accommodationId) {
      return res.status(400).send({ error: "Accommodation ID is required" });
    }

    const accommodation = await Accommodation.findById(accommodationId);

    if (!accommodation) {
      return res.status(404).send({ error: "Accommodation not found" });
    }

    return res.status(200).send({ data: accommodation });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error: "Internal Server Error" });
  }
};
exports.editAccommodation = async (req, res) => {
  try {
    const accommodationId = req.params.id;
    const updates = req.body;

    if (!accommodationId) {
      return res.status(400).send({ error: "Accommodation ID is required" });
    }

    const updatedAccommodation = await Accommodation.findByIdAndUpdate(
      accommodationId,
      updates,
      { new: true }
    );

    if (!updatedAccommodation) {
      return res.status(404).send({ error: "Accommodation not found" });
    }

    return res
      .status(200)
      .send({
        message: "Accommodation updated successfully",
        data: updatedAccommodation,
      });
  } catch (error) {
    console.error("Error editing accommodation:", error);
    return res.status(500).send({ error: "Internal Server Error" });
  }
};

module.exports = router;
