const Notification = require("../models/Notification");
const { uploadImage, deleteImage } = require("../services/cloudinary");
const axios = require("axios");

exports.createNotification = async (req, res) => {
  try {
    const { user_id, title, message } = req.body;

    if (!title || !message) {
      return res
        .status(400)
        .json({ error: "Title and message are required fields." });
    }

    const newNotification = new Notification({
      user_id,
      title,
      message,
    });

    // Save the notification to the database
    await newNotification.save();

    return res.status(201).json({
      message: "Notification created successfully.",
      notification: newNotification,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

//==========================================! send notification admin to user !============================

exports.sendNotificationToAllUsers = async (req, res) => {
  try {
    const { title, message, recipientType } = req.body;
    const { file } = req; 

    if (!title || !message) {
      return res.status(400).json({ error: "Title and message are required fields." });
    }

    let imageUrl = null;

    if (file) {
      const fileName = `notification-image-${Date.now()}.jpeg`;
      const folderName = "notification-images";
      imageUrl = await uploadImage(file.buffer, fileName, folderName);
    }

    const newNotification = new Notification({
      title,
      message,
      recipientType,
      image: imageUrl || null,
    });

    await newNotification.save();

    if (recipientType === "users") {
      const notificationData = {
        topic: "smc_users",
        title: title,
        body: message,
        type: "global",
        id: "1",
        imageUrl: imageUrl || undefined,
      };

      await axios.post("https://www.sortmycollegeapp.com/notification/send-notification-to-topic", notificationData);
    }

    return res.status(201).json({
      message: recipientType === "user" ? "Notification created & sent successfully." : "Notification saved successfully.",
      notification: newNotification,
    });

  } catch (error) {
    console.error("Error creating notification:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getUserNotifications = async (req, res) => {

  try {

    const { recipientType } = req.params;

    if (!["users", "counsellors"].includes(recipientType)) {
      return res.status(400).json({ error: "Invalid recipient type " })
    }

    const notifications = await Notification.find({ recipientType });
    return res.status(200).json({ success: true, notifications });

  } catch (error) {
    console.error("Error fetching notifications", error);

    res.status(500).json({ error: "Internal Server Error" })

  }
}


exports.markNotificationAsRead = async (req, res) => {
  try {
    const { userId, notificationId } = req.body;

    console.log("Received userId:", userId);
    console.log("Received notificationId:", notificationId);

    if (!userId || !notificationId) {
      return res.status(400).json({ error: "User ID & Notification ID are required." });
    }

    const notification = await Notification.findById(notificationId);

    if (!notification) {
      return res.status(404).json({ error: "Notification not found." });
    }


    if (notification.userReadStatus.includes(userId)) {
      return res.status(200).json({ message: "Already marked as read.", notification });
    }

    notification.userReadStatus.push(userId);
    await notification.save();

    res.status(200).json({ message: "Notification marked as read.", notification });

  } catch (error) {
    console.error("Error updating notification:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


exports.getNotifications = async (req, res) => {
  try {
    const { user_id, page = 1, limit = 10 } = req.query;
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);

    const skip = (pageNumber - 1) * limitNumber;

    const notifications = await Notification.find({ user_id })
      .sort({ read: 1, createdAt: -1 }) // Sort by read status and createdAt
      .skip(skip)
      .limit(limitNumber);

    const totalCount = await Notification.countDocuments({ user_id });

    return res.status(200).json({
      message: "Notifications retrieved successfully.",
      notifications,
      total_count: totalCount,
      current_page: pageNumber,
      per_page: limitNumber,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getNotification = async (req, res) => {
  try {
    const { user_id } = req.query;
    const { notification_id } = req.params;

    // Fetch a specific notification for the user by ID from the database
    const notification = await Notification.findOne({
      _id: notification_id,
      user_id,
    });

    // Check if the notification exists
    if (!notification) {
      return res.status(404).json({ error: "Notification not found" });
    }

    return res.status(200).json({
      message: "Notification retrieved successfully.",
      notification,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.readNotification = async (req, res) => {
  try {
    const { user_id } = req.query;
    const { notification_id } = req.params;
    const notification = await Notification.findOneAndUpdate(
      { _id: notification_id, user_id },
      { read: true }
    );

    if (!notification)
      return res.status(404).send({
        error: "Notification not found",
      });

    res.status(200).send({
      message: "Notification read",
      notification,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

exports.deleteNotifications = async (req, res) => {
  try {
    const { user_id } = req.query;

    // Validate user_id
    if (!user_id) {
      return res.status(400).json({ error: "User ID is required." });
    }

    // Delete notifications where user_id matches and read is true
    const result = await Notification.deleteMany({ user_id, read: true });

    return res.status(200).json({
      message: "Notifications deleted successfully.",
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
