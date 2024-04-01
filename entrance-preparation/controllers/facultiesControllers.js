const Faculties = require("../models/Faculties");

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
    res.status(200).json(massagedFaculties);
  } catch (error) {
    console.log("error featching faculties", error);
    res.status(500).json({ message: "Tnternal server error" });
  }
};

exports.addFaculties = async (req, res) => {
  try {
    const existingFaculty = await Faculties.findOne({ name: req.body.name });

    if (existingFaculty) {
      return res
        .status(400)
        .send({ error: "Faculty with the same name already exists" });
    }

    const faculty = new Faculties({
      name: req.body.name,
      display_pic: req.body.display_pic,
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