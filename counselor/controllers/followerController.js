const axios = require("axios");
const Counsellor = require("../models/Counsellor");
const Follower = require("../models/Follower");
const Session = require("../models/Session");
require("dotenv").config();

const { BACKEND_URL } = process.env;

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

exports.followCounsellor = async (req, res) => {
  try {
    const { id } = req;
    const { counsellor_id } = req.params;

    // Find the counsellor by ID
    const counsellor = await Counsellor.findOne({ _id: counsellor_id });
    const user = await axios.get(`${BACKEND_URL}/user/users`, {
      params: {
        user_id: id,
      },
    });

    if (!counsellor) {
      return res.status(404).json({ error: "Counsellor not found" });
    }
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    let follower = await Follower.findOne({
      followed_by: id,
      followed_to: counsellor_id,
    });
    if (follower) {
      if (follower.followed === true)
        return res.status(400).send({
          error: "Counsellor is already followed by the user",
        });
      follower.followed = true;
    } else {
      follower = new Follower({
        followed_to: counsellor_id,
        followed_by: id,
        followed: true,
        follower_profile_pic: user.data.profile_pic,
        follower_name: user.data.name,
        follower_email: user.data.email,
      });
    }

    const response = await follower.save();

    // Aggregation to count the total followers
    const followersCount = await Follower.aggregate([
      {
        $match: {
          followed_to: counsellor_id,
        },
      },
      {
        $group: {
          _id: "$followed_to",
          totalFollowers: { $sum: 1 },
        },
      },
    ]);
    counsellor.followers =
      followersCount.length > 0 ? followersCount[0].totalFollowers : 0;
    await counsellor.save();

    res.status(200).json({
      message: "User is now following the counsellor",
      data: response,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.unfollowCounsellor = async (req, res) => {
  try {
    const { id } = req;
    const { counsellor_id } = req.params;

    // Find the counsellor by ID
    const counsellor = await Counsellor.findOne({ _id: counsellor_id });

    if (!counsellor) {
      return res.status(404).json({ error: "Counsellor not found" });
    }

    const follower = await Follower.findOneAndDelete({
      followed_by: id,
      followed_to: counsellor_id,
    });

    if (!follower) return res.status(404).send({ error: "Follower not found" });

    // Aggregation to count the total followers
    const followersCount = await Follower.aggregate([
      {
        $match: {
          followed_to: counsellor_id,
        },
      },
      {
        $group: {
          _id: "$followed_to",
          totalFollowers: { $sum: 1 },
        },
      },
    ]);
    counsellor.followers =
      followersCount.length > 0 ? followersCount[0].totalFollowers : 0;
    console.log(counsellor.followers);
    await counsellor.save();
    res.status(200).json({
      message: "User is now unfollowing the counsellor",
      data: follower,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
