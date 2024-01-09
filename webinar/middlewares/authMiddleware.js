const { default: axios } = require('axios');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const { JWT_SECRET, BACKEND_URL } = process.env;

exports.adminOrUserAuth = async (req, res, next) => {
  try {
    const token = req.header('Authorization');
    if (!token) {
      return res.status(401).json({ error: 'No token found, authorization denied' });
    }

    // Verify the token using your secret key
    const decoded = jwt.verify(token, JWT_SECRET);

    let response = {};
    let responseData = {};
    if (decoded.admin_id) {
      response = await axios.get(`${BACKEND_URL}/admin/admins`,
        null,
        {
          params: {
            email: decoded.email
          }
        })
      responseData = response;
    } else if (decoded.user_id) {
      response = await axios.get(`${BACKEND_URL}/user/users`,
        null,
        {
          params: {
            email: decoded.email
          }
        });
      responseData = response.data;
    }

    if (!responseData) {
      return res.status(401).json({
        error: `${decoded.user_id ? "User" : "Admin"} not authorized`
      });
    }

    req.email = decoded.email;
    req.phone_number = decoded.phone_number;
    req.id = response._id;

    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.adminAuth = async (req, res, next) => {
  try {
    const token = req.header('Authorization');
    if (!token) {
      return res.status(401).json({ error: 'No token found, authorization denied' });
    }

    // Verify the token using your secret key
    const decoded = jwt.verify(token, JWT_SECRET);

    const { data } = await axios.get(`${BACKEND_URL}/admin/admins`,
      null,
      {
        params: {
          email: decoded.email
        }
      })

    if (!data) {
      return res.status(401).json({
        error: `Admin not authorized`
      });
    }

    req.email = decoded.email;
    req.phone_number = decoded.phone_number;
    req.id = data._id;
    console.log(req.id)

    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};