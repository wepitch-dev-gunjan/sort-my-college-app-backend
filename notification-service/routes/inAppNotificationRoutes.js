const express = require("express");
const {
  createNotification,
  getNotifications,
  getNotification,
  readNotification,
  deleteNotifications,
} = require("../controllers/inAppNotificationController");
const router = express.Router();

router.post("/in-app", createNotification);
router.get("/in-app", getNotifications);
router.get("/in-app/:notification_id", getNotification);
router.put("/in-app/:notification_id", readNotification);
router.delete("/in-app", deleteNotifications);

module.exports = router;
