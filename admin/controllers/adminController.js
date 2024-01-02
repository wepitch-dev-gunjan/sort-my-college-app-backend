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
    const { admin_id } = req;
    const admin = await Admin.findOne({ _id: admin_id });

    if (!admin)
      return res.status(400).send({ message: "No admin found by this id" });

    res.status(200).send(admin);
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal server error" });
  }
};

exports.findOneAdmin = async (req, res) => {
  try {
    const { email, admin_id } = req.query;
    const query = {};
    if (email) query.email = email;
    if (admin_id) query._id = admin_id;

    const user = await Admin.findOne(query);

    if (!user) {
      return res.status(400).send({ error: 'Admin not found' });
    }

    res.status(200).send(user);
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
}
