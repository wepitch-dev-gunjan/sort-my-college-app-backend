const { json } = require("express");
const Faculties = require("../models/Faculties");
const { uploadImage } = require("../services/cloudinary");

exports.getFaculties = async (req, res) => {
  try {
    const faculties = await Faculties.find({});
    if (!faculties || faculties.length === 0) {
      return res.status(404).send({ error: "faculties not found" });
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
    const existingFaculty = await Faculties.findOne({ name: req.body.name });

    if (existingFaculty) {
      return res
        .status(400)
        .send({ error: "Faculty with the same name already exists" });
    }

    const fileName = `display_pic-${Date.now()}.png`;
    const folderName = "Faculty_display_pic";
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
