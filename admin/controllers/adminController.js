const Admin = require("../models/Admin");

exports.createAdmin = async (req, res) => {
  try {
    const { name, email, profile_pic } = req.body;

    const newAdmin = new Admin({
      name,
      email,
      profile_pic,
    });
    const data = await newAdmin.save();

    res.status(200).send({
      message: "Admin successfully created",
      data,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal server error" });
  }
};

exports.deleteAdmin = async (req, res) => {
  try {
    const { admin_id } = req;

    const admin = await Admin.findByIdAndDelete(admin_id);

    if (!admin)
      return res
        .status(400)
        .json({ message: "No admin with this id was found." });

    res.status(200).send({ message: "Admin deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal server error" });
  }
};

exports.getAdmin = async (req, res) => {
  try {
    const { admin_id } = req.params;

    const admin = await Admin.findById(admin_id);

    if (!admin)
      return res.status(400).send({ message: "No admin found by this id" });

    res.status(200).send(admin);
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal server error" });
  }
};
