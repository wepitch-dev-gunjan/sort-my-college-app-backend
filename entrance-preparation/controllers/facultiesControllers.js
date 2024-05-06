const { json } = require("express");
const Faculties = require("../models/Faculties");
const { uploadImage } = require("../services/cloudinary");

exports.getFaculties = async (req, res) => {
  const { institute_id } = req;
  console.log(institute_id);
  try {
    const faculties = await Faculties.find({ institute: institute_id });
    if (!faculties || faculties.length === 0) {
      return res.status(200).send([]);
    }
    const massagedFaculties = faculties.map((faculty) => ({
      _id: faculty._id,
      institute_id: institute_id,
      name: faculty.name,
      display_pic: faculty.display_pic,
      experience_in_years: faculty.experience_in_years,
      qualifications: faculty.qualifications,
      graduated_from: faculty.graduated_from,
    }));

    res.status(200).send(massagedFaculties);
  } catch (error) {
    console.log("error featching faculties", error);
    res.status(500).json({ message: "nternal server error" });
  }
};

exports.addFaculty = async (req, res) => {
  try {
    const { file } = req;
    const { institute_id } = req;
    // if (file) {
    //   const fileName = `display_pic-${Date.now()}.png`;
    //   const folderName = `Faculty_display_pics`;
    //   display_pic = await uploadImage(req.file.buffer, fileName, folderName);
    // } else {
    //   display_pic = "https://www.shutterstock.com/search/default";
    // }

    if(!file) {
      return res.status(400).json({message: "Faculty image not found!"})
    }
    const fileName = `faculty_display_pic-${Date.now()}.jpg`;
    const folderName = `faculty-display-pics`;

    const display_pic = await uploadImage(
      file.buffer,
      fileName,
      folderName
    );

    const faculty = new Faculties({
      name: req.body.name,
      display_pic,
      experience_in_years: req.body.experience_in_years,
      qualifications: req.body.qualifications,
      graduated_from: req.body.graduated_from,
      institute: institute_id
    });


    await faculty.save();

    res.status(201).send({ message: "Faculty added successfully ",  newFaculty : faculty});
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
//user
exports.getFacultiesForUser = async (req, res) => {
  const { institute_id } = req.params;
  try {
    const faculties = await Faculties.find({ institute: institute_id });
    if (!faculties || faculties.length === 0) {
      return res.status(200).send([]);
    }
    const massagedFaculties = faculties.map((faculty) => ({
      _id: faculty._id,
      institute_id: institute_id,
      name: faculty.name,
      display_pic: faculty.display_pic,
      experience_in_years: faculty.experience_in_years,
      qualifications: faculty.qualifications,
      graduated_from: faculty.graduated_from,
    }));

    res.status(200).send(massagedFaculties);
  } catch (error) {
    console.log("error featching faculties", error);
    res.status(500).json({ message: "nternal server error" });
  }
};
