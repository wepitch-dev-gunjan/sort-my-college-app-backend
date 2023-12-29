const axios = require("axios");
const Counsellor = require("../models/Counsellor");
const Follower = require("../models/Follower");
require('dotenv').config();

const { BACKEND_URL } = process.env

exports.getFollowers = async (req, res) => {
  try {
    const { counsellor_id } = req;
    const followers = await Follower.find({ followed_to: counsellor_id });

    res.status(200).send(followers);
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

exports.getFollowersCount = async (req, res) => {
  try {
    const { counsellor_id } = req;
    console.log(counsellor_id)
    const followersCount = await Follower.aggregate([
      {
        $match: {
          followed_to: counsellor_id // Match documents with the specific counselorId
        }
      },
      {
        $group: {
          _id: '$followed_to',
          totalFollowers: { $sum: 1 } // Count the number of matching documents
        }
      }
    ]);

    // Extract the total followers count
    const totalFollowers = followersCount.length > 0 ? followersCount[0].totalFollowers : 0;

    res.status(200).json({ totalFollowers });

  } catch (error) {
    console.log(error);
    res.status(500).send({ error: 'Internal Server Error' });
  }
};

exports.followCounsellor = async (req, res) => {
  try {
    const { user_id } = req;
    const { counsellor_id } = req.params;

    // Find the counsellor by ID
    const counsellor = await Counsellor.findOne({ _id: counsellor_id });
    const user = await axios.get(`${BACKEND_URL}/user/users`, {
      user_id
    })

    if (!counsellor) {
      return res.status(404).json({ error: "Counsellor not found" });
    }

    let follower = await Follower.findOne({ followed_by: user_id, followed_to: counsellor_id });
    if (follower) {
      if (follower.followed === true) return res.status(404).send({
        error: 'Counsellor is already followed by the user'
      });
      follower.followed = true;
    } else {
      follower = new Follower({
        followed_to: counsellor_id,
        followed_by: user_id,
        followed: true,
        follower_profile_pic: follower_profile_pic,
        follower_name: user.name,
        follower_email: user.email
      })
    }

    const response = await follower.save();

    res.status(200).json({
      message: "User is now following the counsellor",
      data: response
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.unfollowCounsellor = async (req, res) => {
  try {
    const { user_id } = req;
    const { counsellor_id } = req.params;

    // Find the counsellor by ID
    const counsellor = await Counsellor.findOne({ _id: counsellor_id });

    if (!counsellor) {
      return res.status(404).json({ error: "Counsellor not found" });
    }

    const follower = await Follower.findOne({ followed_by: user_id, followed_to: counsellor_id });

    if (!follower) return res.status(404).send({ error: "Follower not found" });

    if (follower.followed === false) return res.status(404).send({
      error: 'Counsellor is already unfollowed by the user'
    });

    follower.followed = false;

    const response = await follower.save();

    res.status(200).json({
      message: "User is now following the counsellor",
      data: response
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

