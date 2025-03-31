const express = require("express");
const {
  createNotification,
  getNotifications,
  getNotification,
  readNotification,
  deleteNotifications, sendNotificationToAllUsers, getUserNotifications, markNotificationAsRead
} = require("../controllers/inAppNotificationController");
const upload = require("../middlewares/upload_image");
const router = express.Router();

router.post("/create-notification", createNotification);
router.post("/send-notification-all-users", upload.single("image"), sendNotificationToAllUsers);
router.get("/in-app", getNotifications);
router.get("/in-app/:notification_id", getNotification);
router.put("/in-app/:notification_id", readNotification);
router.delete("/in-app", deleteNotifications);
router.get("/get-notifications/:recipientType", getUserNotifications);
router.put("/mark-as-read", markNotificationAsRead);

module.exports = router;
