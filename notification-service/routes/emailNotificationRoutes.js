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
  verifyCounsellorEmailNotification,
  rejectCounsellorEmailNotification,
  generatedHelpNotification,
  verifyInstituteEmailNotification,
  rejectInstituteEmailNotification,
} = require("../controllers/emailNotificationControllers");
const router = express.Router();

router.post("/generateOtp", generatedOtpNotification);
router.post("/generateHelp", generatedHelpNotification);
router.post("/verifiedOtp", verifiedOtpNotification);

router.post("/user/welcome", welcomeUserEmailNotification);
router.post("/user/sessionbooked", bookedSessionUserEmailNotification);
router.post("/user/reminder", reminderSessionUserEmailNotification);
router.post("/user/attended/", attendedSessionUserEmailNotification);
router.post("/user/notattended/", notattendedSessionUserEmailNotification);
router.post("/user/cancelled/", cancelledSessionUserEmailNotification);

router.post("/counsellor/welcome", welcomeCounsellorEmailNotification);
router.post(
  "/counsellor/sessionbooked",
  bookedSessionCounsellorEmailNotification
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
router.post("/counsellor/verify", verifyCounsellorEmailNotification);
router.post("/counsellor/reject", rejectCounsellorEmailNotification);

router.post("/institute/verify", verifyInstituteEmailNotification);
router.post("/institute/reject", rejectInstituteEmailNotification);


module.exports = router;
