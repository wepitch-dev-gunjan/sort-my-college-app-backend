const Admin = require("../models/Admin");
const User = require("../../user/models/User.js");
const bcrypt = require("bcryptjs");
const JWT = require("jsonwebtoken");
const Counsellor = require("../../counselor/models/Counsellor.js");
const { default: axios } = require("axios");
const Payment = require("../models/Payment.js");
require("dotenv").config();
const { BACKEND_URL } = process.env;
const { JWT_SECRET } = process.env;

exports.adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).send({
        error: "Credentials are required",
      });

    const existingAdmin = await Admin.findOne({ email });

    if (!existingAdmin)
      return res.status(404).send({
        error: "Admin not found",
      });

    const passwordMatch = await bcrypt.compare(
      password,
      existingAdmin.password
    );

    if (!passwordMatch)
      return res.status(401).send({
        error: "Invalid password",
      });

    const token = JWT.sign({ email, admin_id: existingAdmin._id }, JWT_SECRET);

    res.status(200).send({
      message: "Login successful",
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.createAdmin = async (req, res) => {
  try {
    const { password, email, name, permissions } = req.body;

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).send({ error: "Invalid email format" });
    }

    // Check if the email already exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).send({ error: "Email already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the new admin with all fields
    const newAdmin = new Admin({
      email,
      name,
      permissions,
      password: hashedPassword,
    });

    // Save the new admin to the database
    const data = await newAdmin.save();

    res.status(200).send({
      message: "Admin successfully created",
      data,
    });
  } catch (error) {
    console.error(error);
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
    // console.log(admin);

    if (!admin)
      return res.status(400).send({ message: "No admin found by this id" });

    res.status(200).send(admin);
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: " admin Internal server error" });
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
    res.status(500).send({ error: "Internal Server Error!!" });
  }
};

exports.getDashboardData = async (req, res) => {
  try {
    const usersResponse = await axios.get(
      `${BACKEND_URL}/user/users-for-admin`
    );
    const counsellorsResponse = await axios.get(
      `${BACKEND_URL}/counsellor/counsellor-for-admin`
    );

    const usersCount = usersResponse.data.length;
    const verifiedCounsellors = counsellorsResponse.data.filter(
      (counsellor) => counsellor.verified === true
    );
    const counsellorsCount = verifiedCounsellors.length;

    const totalPayment = await Payment.aggregate([
      {
        // $group: {
        //   _id: null,
        //   totalAmountDue: { $sum: "$amount_due" },
        // },
        $group: {
          _id: null,
          totalAmountDue: { $sum: "$amount" },
        },
      },
    ]);

    res.status(200).send({
      totalUser: usersCount,
      totalCounsellor: counsellorsCount,
      totalPayment:
        totalPayment.length > 0 ? totalPayment[0].totalAmountDue : 0,
    });
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    res.status(500).send({
      error: "Failed to fetch dashboard data. Please try again later.",
    });
  }
};
exports.changePassword = async (req, res) => {
  const { key, password } = req.body;

  if (!key || !password) {
    return res
      .status(400)
      .send({ message: "Key and new password are required" });
  }

  try {
    // Fetch the admin from the database
    const admin = await Admin.findOne();
    if (!admin) {
      return res.status(404).send({ message: "Admin not found" });
    }

    // Check if the provided key is correct
    if (key !== "1234") {
      return res.status(401).send({ message: "Key is incorrect" });
    }

    // Hash the new password
    const hashedNewPassword = await bcrypt.hash(password, 10);

    // Update the admin's password
    admin.password = hashedNewPassword;

    // Save the updated admin to the database
    await admin.save();

    res
      .status(200)
      .send({ message: "Password changed successfully", data: admin });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Internal server error" });
  }
};
