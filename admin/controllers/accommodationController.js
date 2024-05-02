const { uploadImage } = require("../../entrance-preparation/services/cloudinary");
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
   
   const images = [];
   for (const file of req.files) {
     const fileName = `course-image-${Date.now()}.png`;
     const folderName = `ep-course_images`;
     const imagePath = await uploadImage(file.buffer, fileName, folderName);
     images.push(imagePath);

   }   const newAccommodation = new Accommodation({
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
     gate_opening_time,
     gate_closing_time,
   });


   await newAccommodation.save();
   res.status(201).send({ message: "Accommodation added successfully", newAccommodation });
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
    console.log(updates);

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
