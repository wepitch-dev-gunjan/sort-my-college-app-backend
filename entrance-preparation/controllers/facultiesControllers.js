const { json } = require("express");
const Faculties = require("../models/Faculties");
const { uploadImage } = require("../services/cloudinary");

exports.getFaculties = async (req, res) => {
  try {
    const faculties = await Faculties.find({});
    if (!faculties || faculties.length === 0) {
      return res.status(200).send([]);
    }
    const massagedFaculties = faculties.map((faculties) => ({
      _id: faculties._id,
      name: faculties.name,
      display_pic: faculties.display_pic,
      experience_in_years: faculties.experience_in_years,
      qualifications: faculties.qualifications,
      graduated_from: faculties.graduated_from,
    }));

    res.status(200).send(massagedFaculties);
  } catch (error) {
    console.log("error featching faculties", error);
    res.status(500).json({ message: "Tnternal server error" });
  }
};

exports.addFaculties = async (req, res) => {
  const { file } = req;
  try {
    const fileName = `display_pic-${Date.now()}.png`;
    const folderName = `Faculty_display_pic`;
    const display_pic = await uploadImage(file.buffer, fileName, folderName);

    const faculty = new Faculties({
      name: req.body.name,
      display_pic,
      experience_in_years: req.body.experience_in_years,
      qualifications: req.body.qualifications,
      graduated_from: req.body.graduated_from,
      institute: req.body.institute,
    });

    await faculty.save();

    res.status(201).send({ message: "added " });
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
};

exports.deleteFaculty = async (req, res) => {
  const { faculty_id } = req.params;
  try {
    const faculty = await Faculties.findByIdAndDelete(faculty_id);
    if (!faculty)
      return res.status(404).send({ error: "no faculty found with this id" });

    return res.status(200).send({ message: "Faculty deleted" });
  } catch (error) {
    console.log(error);
  }
};
exports.editFaculties = async (req, res) => {
  try {
    const { faculty_id } = req.params;
    const updateFaculty = req.body;
    // console.log(updateFaculty);
    const updatedData = await Faculties.findByIdAndUpdate(
      faculty_id,
      updateFaculty,
      { new: true }
    );
    if (!updatedData) {
      return res.status(404).json({ message: "Faculty Not Found" });
    }
    res.status(200).json(updatedData);
  } catch (error) {
    console.log("Error Editing Faculty");
    res.status(500).json({ message: "Internal Server Error" });
  }
};
