const { uploadToS3 } = require("../helpers/feedHelpers");
const { upload } = require("../middlewares/formMiddlewares");
const Comment = require("../models/Comment");
const Counsellor = require("../models/Counsellor");
const Course = require("../models/Course");
const Feed = require("../models/Feed");

exports.getFeedComments = async (req, res) => {
  try {
    const { feed_id } = req.params;

    const feed = await Feed.findById(feed_id);
    if (!feed) return res.status(404).send({ error: "Feed not found" });

    const comments = await Comment.find({ feed_id });

    res.status(200).send(comments);
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

exports.getFeedComment = async (req, res) => {
  try {
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

exports.editFeedComment = async (req, res) => {
  try {
    const { comment_id } = req.params;
    const { comment_text } = req.body;

    const comment = await Comment.findById(comment_id);
    if (!comment) return res.status(404).send({ error: "Comment not found" });

    if (comment_text) comment.comment_text = comment_text;

    comment.save();

    res.status(200).send({ message: "Comment has been updated" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

exports.hideFeedComment = async (req, res) => {
  try {
    const { comment_id } = req.params;

    const comment = await Comment.findById(comment_id);
    if (!comment) return res.status(404).send({ error: "Comment not found" });

    if (comment.comment_visibility === true) comment.comment_visibility = false;

    await comment.save();
    res.status(200).send({ message: "Comment has been hidden successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

exports.unhideFeedComment = async (req, res) => {
  try {
    const { comment_id } = req.params;

    const comment = await Comment.findById(comment_id);
    if (!comment) return res.status(404).send({ error: "Comment not found" });

    if (comment.comment_visibility === false) comment.comment_visibility = true;

    await comment.save();
    res.status(200).send({ message: "Comment has been unhide successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

exports.postFeedComment = async (req, res) => {
  try {
    const { feed_id } = req.params;
    const { comment_text } = req.body;

    if (!comment_text)
      return res.status(404).send({ error: "Comment text is neccessary" });

    const feed = await Feed.findById(feed_id);
    if (!feed) return res.status(404).send({ error: "Feed not found" });

    const comment = new Comment({
      comment_text,
      feed_id,
    });

    await comment.save();
    res.status(200).send({ message: "Comment sent", comment });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

exports.deleteFeedComment = async (req, res) => {
  try {
    const { comment_id } = req.params;

    const comment = await Comment.findByIdAndDelete(comment_id);

    if (!comment) return res.status(404).send({ error: "Comment not found" });

    res.status(200).send({ message: "Comment deleted" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};
