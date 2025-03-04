const express = require("express");
const {
  postNotification, sendNotificationToTopic, sendNotificationToToken
} = require("../controllers/pushNotificationControllers");
const router = express.Router();

// COUNSELLOR NOTIFICATIONS
router.post("/counsellor/", postNotification);

// USER NOTIFICATIONS
router.post("/user/", postNotification);

// SEND NOTIFICATION WITH FIREBASE
router.post("/send-notification-to-topic", sendNotificationToTopic);
router.post("/send-notification-to-token", sendNotificationToToken);

module.exports = router;
