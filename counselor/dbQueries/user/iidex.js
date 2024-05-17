const axios = require("axios");
require("dotenv").config();
const { BACKEND_URL } = process.env;

class User {
  static async findOne(query) {
    const q = {};
    if (query.email) q.email = query.email;
    if (query._id) q.user_id = query._id;

    try {
      const { data } = await axios.get(`${BACKEND_URL}/user/users`, {
        params: q,
      });
      return data; // Assuming you want to return the data from the response
    } catch (error) {
      throw error;
    }
  }
}

module.exports = User;
