const express = require("express");
const {
  createNotification,
  getNotifications,
  getNotification,
  readNotification,
  deleteNotifications,
} = require("../controllers/inAppNotificationController");
const upload = require("../middlewares/upload_image");
const router = express.Router();

router.post("/create-notification", upload.single("image"), createNotification);
router.get("/in-app", getNotifications);
router.get("/in-app/:notification_id", getNotification);
router.put("/in-app/:notification_id", readNotification);
router.delete("/in-app", deleteNotifications);

module.exports = router;
