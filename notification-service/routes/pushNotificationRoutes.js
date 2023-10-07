const express = require("express");
const {
  postNotification,
} = require("../controllers/pushNotificationControllers");
const router = express.Router();

// COUNSELLOR NOTIFICATIONS
router.post("/counsellor/", postNotification);

// USER NOTIFICATIONS
router.post("/user/", postNotification);

module.exports = router;
