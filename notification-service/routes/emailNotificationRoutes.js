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
  sessionCancelRequestCounsellorAdminEmailNotification,
  sessionCancelRequestUserAdminEmailNotification,
  sessionRescheduleRequestUserAdminEmailNotification,
  sessionRescheduleRequestCounsellorAdminEmailNotification,
} = require("../controllers/emailNotificationControllers");
const router = express.Router();

router.post("/generateOtp", generatedOtpNotification);
router.post("/verifiedOtp", verifiedOtpNotification);

//user
router.post("/user/welcome", welcomeUserEmailNotification);
router.post("/user/sessionbooked", bookedSessionUserEmailNotification);
router.post("/user/reminder", reminderSessionUserEmailNotification);
router.post("/user/attended/", attendedSessionUserEmailNotification);
router.post("/user/notattended/", notattendedSessionUserEmailNotification);
router.post("/user/cancelled/", cancelledSessionUserEmailNotification);
router.post(
  "/user/reschedulerequest/",
  sessionRescheduleRequestUserAdminEmailNotification
);
router.post(
  "/user/cancelrequest/",
  sessionCancelRequestUserAdminEmailNotification
);

//counsellor
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
router.post(
  "/counsellor/cancelrequest/",
  sessionCancelRequestCounsellorAdminEmailNotification
);
router.post(
  "/counsellor/reschedulerequest/",
  sessionRescheduleRequestCounsellorAdminEmailNotification
);

module.exports = router;
