const express = require("express");
const {
  welcomeUserEmailNotification,
  welcomeCounsellorEmailNotification,
  bookedSessionUserEmailNotification,
  bookedSessionCounsellorEmailNotification,
  reminderSessionUserEmailNotification,
  reminderSessionCounsellorEmailNotification,
  attendedSessionUserEmailNotification,
  attendedSessionCounsellorEmailNotification,
  verifiedOtpNotification,
  generatedOtpNotification,
  notattendedSessionUserEmailNotification,
  cancelledSessionUserEmailNotification,
  notattendedSessionCounsellorEmailNotification,
  cancelledSessionCounsellorEmailNotification,
  gotreviewSessionCounsellorEmailNotification,
} = require("../controllers/emailNotificationControllers");
const router = express.Router();

router.post('/generateOtp', generatedOtpNotification);
router.post('/verifiedOtp', verifiedOtpNotification);

router.post("/user/welcome", welcomeUserEmailNotification);
router.post("/user/sessionbooked", bookedSessionUserEmailNotification);
router.post("/user/reminder", reminderSessionUserEmailNotification);
router.post("/user/attended/", attendedSessionUserEmailNotification);
router.post("/user/notattended/", notattendedSessionUserEmailNotification);
router.post("/user/cancelled/", cancelledSessionUserEmailNotification);

router.post("/counsellor/welcome", welcomeCounsellorEmailNotification);
router.post("/counsellor/sessionbooked", bookedSessionCounsellorEmailNotification
);
router.post("/counsellor/reminder", reminderSessionCounsellorEmailNotification);
router.post(
  "/counsellor/attended/",
  attendedSessionCounsellorEmailNotification
);
router.post(
  "/counsellor/notattended/",
  notattendedSessionCounsellorEmailNotification
);
router.post(
  "/counsellor/cancelled/",
  cancelledSessionCounsellorEmailNotification
);
router.post(
  "/counsellor/gotreview/",
  gotreviewSessionCounsellorEmailNotification
);

module.exports = router;
