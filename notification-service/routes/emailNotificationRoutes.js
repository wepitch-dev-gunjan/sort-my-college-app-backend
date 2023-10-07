const express = require("express");
const {
  welcomeUserEmailNotification,
} = require("../controllers/emailNotificationControllers");
const router = express.Router();

router.post("/user/welcome", welcomeUserEmailNotification);

module.exports = router;
