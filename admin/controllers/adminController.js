const Admin = require("../models/Admin");
const bcrypt = require("bcrypt");
const JWT = require("jsonwebtoken");
require("dotenv").config();

const { JWT_SECRET } = process.env;

exports.adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return ses.status(400).send({
        error: "Credentials are required",
      });

    const existingAdmin = await Admin.findOne({ email });

    if (!existingAdmin)
      return res.status(404).send({
        error: "Admin not found",
      });

    const passwordMatch = bcrypt.compare(password, existingAdmin.password);

    if (!passwordMatch)
      return res.status(401).send({
        error: "Invalid password",
      });

    const token = JWT.sign(
      { email, password, admin_id: existingAdmin._id },
      JWT_SECRET
    );

    res.status(200).send({
      message: "Login succesful",
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.createAdmin = async (req, res) => {
  try {
    const {
      password,
      // email, profile_pic
    } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const newAdmin = new Admin({
      password: hashedPassword,
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
      return res.status(400).send({ error: "Admin not found" });
    }

    res.status(200).send(user);
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

exports.editProfile = async (req, res) => {
  try {
    const { admin_id } = req;
    const updateFields = {};

    if (req.body.name) {
      updateFields.name = req.body.name;
    }

    if (req.body.email) {
      updateFields.email = req.body.email;
    }

    if (req.body.profile_pic) {
      updateFields.profile_pic = req.body.profile_pic;
    }

    if (req.body.gender) {
      updateFields.gender = req.body.gender;
    }

    if (req.body.date_of_birth) {
      updateFields.date_of_birth = req.body.date_of_birth;
    }

    const updatedAdmin = await Admin.findByIdAndUpdate(admin_id, updateFields, {
      new: true,
    });

    if (!updatedAdmin) {
      return res.status(404).json({ error: "Admin not found" });
    }

    console.log(updatedAdmin);
    res.status(200).json(updatedAdmin);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getOneAdmin = async (req, res) => {
  try {
    const { admin_id } = req.params;
    const admin = await Admin.findOne({ _id: admin_id });
    if (!admin) return res.status(404).json({ error: "Admin not found" });

    res.status(200).json(admin);
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

exports.getProfilePic = async (req, res) => {
  try {
    const { admin_id } = req.params;

    const admin = await Counsellor.findById(admin_id);
    if (!admin) return res.status(404).send({ error: "Counsellor not found" });

    if (!admin.profile_pic)
      return res.status(404).send({ error: "ProfilePic not found" });

    res.status(200).send(admin.profile_pic);
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

exports.uploadProfilePic = async (req, res) => {
  try {
    const { file, admin_id } = req;

    if (!file) {
      return res.status(400).send({
        error: "File can't be empty",
      });
    }

    const admin = await Admin.findById(admin_id);

    if (!admin) {
      return res.status(404).send({ error: "Admin not found" });
    }

    const fileName = `admin-profile-pic-${Date.now()}.jpeg`;
    const foldername = "admin-profile-pics";
    const profilePicUpload = await putObject(
      foldername,
      fileName,
      file.buffer,
      file.mimetype
    );

    if (!profilePicUpload) {
      return res.status(400).send({
        error: "Profile pic is not uploaded",
      });
    }

    admin.profile_pic = `${foldername}/${fileName}`;
    await admin.save();

    res.status(200).send({
      message: "Profile pic uploaded successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};
