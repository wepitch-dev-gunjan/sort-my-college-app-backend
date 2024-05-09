const Admin = require("../models/Admin");
const User = require("../../user/models/User.js");
const bcrypt = require("bcrypt");
const JWT = require("jsonwebtoken");
const Counsellor = require("../../counselor/models/Counsellor.js");
const { default: axios } = require("axios");
const Document = require("../../counselor/models/Document.js");
require("dotenv").config();
const { BACKEND_URL } = process.env;
const { JWT_SECRET } = process.env;

exports.getDocuments = async (req, res) => {
  try {
    const { counsellor_id } = req.params;

    const documents = await Document.find({
      user: counsellor_id,
    });
    if (!documents)
      return res.status(404).send({
        error: "Documents not found",
      });
    res.status(200).send(documents);
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};
