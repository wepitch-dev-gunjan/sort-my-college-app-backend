const SuperAdmin = require("../models/superAdmin");

exports.createSuperAdmin = async (req, res) => {
  try {
    const { name, email, profile_pic } = req.body;

    const newSuperAdmin = new SuperAdmin({
      name,
      email,
      profile_pic,
    });
    const data = await newSuperAdmin.save();

    res.status(200).send({
      message: "Super admin successfully created",
      data,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal server error" });
  }
};
