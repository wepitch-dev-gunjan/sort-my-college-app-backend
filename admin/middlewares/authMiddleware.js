const jwt = require("jsonwebtoken");
const { default: axios } = require("axios");
const Admin = require("../models/Admin");
const User = require("../dbQueries/user/iidex");
require("dotenv").config();
const { JWT_SECRET } = process.env;
const { BACKEND_URL } = process.env;

exports.adminAuth = async (req, res, next) => {
  try {
    const token = req.header("Authorization");
    if (!token) {
      return res
        .status(401)
        .json({ error: "No token found, authorization denied" });
    }

    // Verify the token using your secret key
    const decoded = jwt.verify(token, JWT_SECRET);

    const admin = await Admin.findOne({ email: decoded.email });

    if (!admin) {
      return res.status(401).json({ error: "Admin not authorized" });
    }

    req.email = decoded.email;
    req.admin_id = decoded.admin_id;
    req.permissions = admin.permissions;
    // req.refresh_token = decoded.tokens.refresh_token;

    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: " auth Internal Server Error" });
  }
};

exports.permissionAuth = async (req, res) => {
  try {
    const { token } = req.headers['Authorization']
    const decoded = jwt.verify(token, JWT_SECRET)
    const admin = await Admin.findOne({ email: decoded.email })
    const permissions = admin.permissions;
    if (!permissions.includes(req.permission)) {
      return res.status(401).json({ error: "Admin not authorized" });
    }

    next()
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: 'Internal Server Error' });
  }
};

exports.counsellorOrUserAuth = async (req, res, next) => {
  try {
    const token = req.header("Authorization");
    if (!token) {
      return res
        .status(401)
        .json({ error: "No token found, authorization denied" });
    }
    // Verify the token using your secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Update JWT_SECRET to use process.env

    let response = {};
    let responseData = {};
    if (decoded.counsellor_id) {
      response = await axios.get(
        `${process.env.BACKEND_URL}/counsellor/counsellors/find-one`,
        {
          // Update BACKEND_URL to use process.env
          params: {
            email: decoded.email,
          },
        }
      );
      responseData = response.data;
    } else if (decoded.user_id) {
      response = await axios.get(`${process.env.BACKEND_URL}/user/users`, {
        // Update BACKEND_URL to use process.env
        params: {
          email: decoded.email,
        },
      });
      responseData = response.data;
    }

    if (!responseData) {
      return res.status(401).json({
        error: `${decoded.user_id ? "User" : "Counsellor"} not authorized`,
      });
    }

    req.email = decoded.email;
    req.phone_number = decoded.phone_number;
    req.id = responseData._id; // Update response to responseData
    console.log("sussess");
    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: " AUTH Internal Server Error" });
  }
};

exports.userAuth = async (req, res, next) => {
  try {
    const token = req.header("Authorization");
    if (!token) {
      return res
        .status(401)
        .json({ error: "No token found, authorization denied" });
    }

    // Verify the token using your secret key
    const decoded = jwt.verify(token, JWT_SECRET);

    const user = await User.findOne({ _id: decoded.user_id });
    console.log(user);

    if (!user) {
      return res.status(401).json({ error: "User not authorized" });
    }

    req.email = decoded.email;
    req.phoneNo = decoded.phoneNo;
    req.user_id = decoded.user_id;

    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.counsellorAuth = async (req, res, next) => {
  try {
    const token = req.header("Authorization");

    if (!token) {
      return res
        .status(401)
        .json({ error: "No token found, authorization denied" });
    }

    // Verify the token using your secret key
    const decoded = jwt.verify(token, JWT_SECRET);

    const { data } = await axios.get(
      `${process.env.BACKEND_URL}/counsellor/counsellors/find-one`,
      {
        // Update BACKEND_URL to use process.env
        params: {
          email: decoded.email,
        },
      }
    );

    if (!data) {
      return res.status(401).json({ error: "User not authorized" });
    }

    req.email = decoded.email;
    req.phoneNo = decoded.phoneNo;
    req.counsellor_id = data._id;

    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error in auth" });
  }
};

exports.epAuth = async (req, res, next) => {
  try {
    const token = req.header("Authorization");

    if (!token) {
      return res
        .status(401)
        .json({ error: "No token found, authorization denied" });
    }

    // Verify the token using your secret key
    const decoded = jwt.verify(token, JWT_SECRET);

    const { data } = await axios.get(
      `${process.env.BACKEND_URL}/ep/institute/find-one`,
      {
        params: {
          institute_id: decoded.institute_id,
        },
      }
    );

    if (!data) {
      return res.status(401).json({ error: "User not authorized" });
    }

    req.email = decoded.email;
    req.phoneNo = decoded.phoneNo;
    req.institute_id = decoded.institute_id;

    next();
  } catch (error) {
    console.log(error);
    res.status(500).send({
      error: "Internal server error!!!!!",
    });
  }
};

exports.paymentReadAuth = async (req, res, next) => {
  try {
    const { permissions } = req;
    if (permissions.includes("payment_read")) next();
    else
      res.status(403).send({
        error: "Unauthorized access",
      });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      error: "Internal server error",
    });
  }
};
exports.paymentWriteAuth = async (req, res, next) => {
  try {
    const { permissions } = req;
    if (permissions.includes("payment_write")) next();
    else
      res.status(403).send({
        error: "Unauthorized access",
      });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      error: "Internal server error",
    });
  }
};
exports.counsellorReadAuth = async (req, res, next) => {
  try {
    const { permissions } = req;
    if (permissions.includes("counsellor_read")) next();
    else
      res.status(403).send({
        error: "Unauthorized access",
      });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      error: "Internal server error",
    });
  }
};
exports.counsellorWriteAuth = async (req, res, next) => {
  try {
    const { permissions } = req;
    if (permissions.includes("counsellor_write")) next();
    else
      res.status(403).send({
        error: "Unauthorized access",
      });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      error: "Internal server error",
    });
  }
};
exports.userReadAuth = async (req, res, next) => {
  try {
    const { permissions } = req;
    if (permissions.includes("user_read")) next();
    else
      res.status(403).send({
        error: "Unauthorized access",
      });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      error: "Internal server error",
    });
  }
};
exports.userWriteAuth = async (req, res, next) => {
  try {
    const { permissions } = req;
    if (permissions.includes("user_write")) next();
    else
      res.status(403).send({
        error: "Unauthorized access",
      });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      error: "Internal server error",
    });
  }
};
exports.instituteReadAuth = async (req, res, next) => {
  try {
    const { permissions } = req;
    if (permissions.includes("institute_read")) next();
    else
      res.status(403).send({
        error: "Unauthorized access",
      });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      error: "Internal server error",
    });
  }
};
exports.instituteWriteAuth = async (req, res, next) => {
  try {
    const { permissions } = req;
    if (permissions.includes("institute_write")) next();
    else
      res.status(403).send({
        error: "Unauthorized access",
      });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      error: "Internal server error",
    });
  }
};
exports.accommodationReadAuth = async (req, res, next) => {
  try {
    const { permissions } = req;
    if (permissions.includes("accommodation_read")) next();
    else
      res.status(403).send({
        error: "Unauthorized access",
      });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      error: "Internal server error",
    });
  }
};
exports.accommodationWriteAuth = async (req, res, next) => {
  try {
    const { permissions } = req;
    if (permissions.includes("accommodation_write")) next();
    else
      res.status(403).send({
        error: "Unauthorized access",
      });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      error: "Internal server error",
    });
  }
};
exports.bannersReadAuth = async (req, res, next) => {
  try {
    const { permissions } = req;
    if (permissions.includes("banners_read")) next();
    else
      res.status(403).send({
        error: "Unauthorized access",
      });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      error: "Internal server error",
    });
  }
};
exports.bannersWriteAuth = async (req, res, next) => {
  try {
    const { permissions } = req;
    if (permissions.includes("banners_write")) next();
    else
      res.status(403).send({
        error: "Unauthorized access",
      });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      error: "Internal server error",
    });
  }
};
exports.helpReadAuth = async (req, res, next) => {
  try {
    const { permissions } = req;
    if (permissions.includes("help_read")) next();
    else
      res.status(403).send({
        error: "Unauthorized access",
      });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      error: "Internal server error",
    });
  }
};
exports.helpWriteAuth = async (req, res, next) => {
  try {
    const { permissions } = req;
    if (permissions.includes("help_write")) next();
    else
      res.status(403).send({
        error: "Unauthorized access",
      });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      error: "Internal server error",
    });
  }
};
exports.adminReadAuth = async (req, res, next) => {
  try {
    const { permissions } = req;
    if (permissions.includes("admin_read")) next();
    else
      res.status(403).send({
        error: "Unauthorized access",
      });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      error: "Internal server error",
    });
  }
};
exports.adminWriteAuth = async (req, res, next) => {
  try {
    const { permissions } = req;
    if (permissions.includes("admin_write")) next();
    else
      res.status(403).send({
        error: "Unauthorized access",
      });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      error: "Internal server error",
    });
  }
};

exports.paymentReadCheck = async (req, res, next) => {
  try {
    req.permission = "payment_read";
    next()
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: 'Internal Server Error' });
  }
};
exports.counsellorReadCheck = async (req, res, next) => {
  try {
    req.permission = "counsellor_read";
    next()
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: 'Internal Server Error' });
  }
};
exports.counsellorWriteCheck = async (req, res, next) => {
  try {
    req.permission = "counsellor_write";
    next()
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: 'Internal Server Error' });
  }
};
exports.userReadCheck = async (req, res, next) => {
  try {
    req.permission = "user_read";
    next()
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: 'Internal Server Error' });
  }
};
exports.userWriteCheck = async (req, res, next) => {
  try {
    req.permission = "user_write";
    next()
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: 'Internal Server Error' });
  }
};
exports.instituteReadCheck = async (req, res, next) => {
  try {
    req.permission = "institute_read";
    next()
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: 'Internal Server Error' });
  }
};
exports.instituteWriteCheck = async (req, res, next) => {
  try {
    req.permission = "institute_write";
    next()
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: 'Internal Server Error' });
  }
};
exports.accommodationReadCheck = async (req, res, next) => {
  try {
    req.permission = "accommodation_read";
    next()
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: 'Internal Server Error' });
  }
};
exports.accommodationWriteCheck = async (req, res, next) => {
  try {
    req.permission = "accommodation_write";
    next()
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: 'Internal Server Error' });
  }
};
exports.bannersReadCheck = async (req, res, next) => {
  try {
    req.permission = "banners_read";
    next()
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: 'Internal Server Error' });
  }
};
exports.bannersWriteCheck = async (req, res, next) => {
  try {
    req.permission = "banners_write";
    next()
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: 'Internal Server Error' });
  }
};
exports.helpReadCheck = async (req, res, next) => {
  try {
    req.permission = "help_read";
    next()
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: 'Internal Server Error' });
  }
};
exports.helpWriteCheck = async (req, res, next) => {
  try {
    req.permission = "help_write";
    next()
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: 'Internal Server Error' });
  }
};
exports.adminReadCheck = async (req, res, next) => {
  try {
    req.permission = "admin_read";
    next()
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: 'Internal Server Error' });
  }
};
exports.adminWriteCheck = async (req, res, next) => {
  try {
    req.permission = "admin_write";
    next()
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: 'Internal Server Error' });
  }
};
