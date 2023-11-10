const { uploadToS3 } = require("../helpers/feedHelpers");
const { upload } = require("../middlewares/formMiddlewares");
const Comment = require("../models/Comment");
const Counsellor = require("../models/Counsellor");
const Course = require("../models/Course");
const Feed = require("../models/Feed");

exports.createFeed = async (req, res) => {
  try {
    const { feed_link, feed_caption } = req.body;

    const feedObj = {};
    if (feed_caption) feedObj.feed_caption = feed_caption;

    const { counsellor_id } = req.params;

    const counsellor = await Counsellor.findById(counsellor_id);
    if (!counsellor)
      return res.status(404).send({ error: "Counsellor not found" });

    feedObj.feed_owner = counsellor_id;
    const newFeed = new Feed({
      feed_owner: counsellor_id,
      feed_link,
      feed_caption,
    });

    await newFeed.save();

    res.status(200).send({ message: "Feed created successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getFeeds = async (req, res) => {
  try {
    const { counsellor_id } = req.params;
    let { feed_visibility } = req.query;

    if (!feed_visibility) feed_visibility = true;
    const counsellor = await Counsellor.findById(counsellor_id);
    if (!counsellor)
      return res.status(404).send({ error: "Counsellor not found" });

    const feeds = await Feed.find({
      feed_owner: counsellor_id,
      feed_visibility,
    });
    res.status(200).send(feeds);
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

exports.getFeed = async (req, res) => {
  try {
    const { feed_id } = req.params;

    const feed = await Feed.findOne({ _id: feed_id });
    if (!feed) return res.status(404).send({ error: "Feed not found" });

    res.status(200).send(feed);
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

exports.likeFeed = async (req, res) => {
  try {
    const { feed_id } = req.params;
    const { user_id } = req.body; // change it after auth

    const feed = await Feed.findById(feed_id);
    if (!feed) return res.status(404).send({ error: "Feed not found" });

    if (feed.feed_likes.includes(user_id))
      return res.status(404).send({ error: "Feed already liked" });
    feed.feed_likes.push(user_id);

    await feed.save();
    res.status(200).send({ message: "Feed has been liked" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

exports.saveFeed = (req, res) => {
  try {
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

exports.unsaveFeed = (req, res) => {
  try {
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

exports.editFeed = async (req, res) => {
  try {
    const { feed_caption } = req.body;
    const { feed_id } = req.params;

    const feed = await Feed.findById(feed_id);
    if (!feed) return res.status(404).send({ error: "Feed not found" });

    if (feed_caption) feed.feed_caption = feed_caption;

    await feed.save();

    res.status(200).send({ message: "Feed edited successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.deleteFeed = async (req, res) => {
  try {
    const { feed_id } = req.params;

    const feed = await Feed.findOneAndDelete({ _id: feed_id });

    if (!feed) return res.status(404).send({ error: "Feed not found" });

    res.status(200).send({ message: "Feed deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

exports.hideFeed = async (req, res) => {
  try {
    const { feed_id } = req.params;

    const feed = await Feed.findOne({ _id: feed_id });
    if (!feed) return res.status(404).send({ error: "Feed not found" });

    if (feed.feed_visibility === false)
      return res.status(405).send({ error: "Feed is already hidden" });

    if (feed.feed_visibility === true) feed.feed_visibility = false;

    await feed.save();

    res.status(200).send({ message: "Feed has been hidden successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

exports.unhideFeed = async (req, res) => {
  try {
    const { feed_id } = req.params;

    const feed = await Feed.findById(feed_id);
    if (!feed) return res.status(404).send({ error: "Feed not found" });

    if (feed.feed_visibility === true)
      return res.status(405).send({ error: "Feed is already visible" });

    if (feed.feed_visibility === false) feed.feed_visibility = true;

    await feed.save();

    res.status(200).send({ message: "Feed has been unhide successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

exports.getLikes = async (req, res) => {
  try {
    const { feed_id } = req.params;

    const feed = await Feed.findById(feed_id);
    if (!feed) return res.status(404).send({ error: "Feed not found" });

    const likes = feed.feed_likes.length;
    res.status(200).send({ likes });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

exports.unlikeFeed = async (req, res) => {
  try {
    const { feed_id } = req.params;
    const { user_id } = req.body; // change it after auth

    const feed = await Feed.findById(feed_id);
    if (!feed) return res.status(404).send({ error: "Feed not found" });

    if (!feed.feed_likes.includes(user_id))
      return res.status(404).send({ error: "Feed already unliked" });

    feed.feed_likes = feed.feed_likes.filter((e) => e != user_id);

    await feed.save();
    res.status(200).send({ message: "Feed has been unliked" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};
