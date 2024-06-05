const express = require("express");
const {
  getWebinarsForAdmin,
  getSingleWebinarForAdmin,
  addWebinar,
  editWebinar,
  deleteWebinar,
  zoomGenerateSignature,
  getWebinarsForUser,
  registerParticipant,
  getSingleWebinarForUser,
  removeParticipant,
  getTrendingWebinars,
  getMyWebinars,
  attendedParticipant,
} = require("../controllers/webinarController");
const { adminAuth, userAuth } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/uploadBanner");
const router = express.Router();

router.get("/webinar/webinar-for-admin", getWebinarsForAdmin);
router.get("/webinar/webinar-for-admin/:webinar_id", getSingleWebinarForAdmin);
router.get("/webinar/webinar-for-user", userAuth, getWebinarsForUser);
router.get("/webinar/webinar-for-user/my-webinars", userAuth, getMyWebinars);
router.get(
  "/webinar/webinar-for-user/trending-webinars",
  userAuth,
  getTrendingWebinars
);
router.get(
  "/webinar/webinar-for-user/:webinar_id",
  userAuth,
  getSingleWebinarForUser
);
router.post("/webinar/generate-signature", zoomGenerateSignature);

router.post("/webinar", adminAuth, upload.single("webinar_image"), addWebinar);
router.put("/webinar", adminAuth, editWebinar);
router.put(
  "/webinar/webinars-for-user/:webinar_id",
  userAuth,
  registerParticipant
);
router.put(
  "/webinar/webinar-attended-user/:webinar_id",
  userAuth,
  attendedParticipant
);

router.delete(
  "/webinar/webinars-for-user/:webinar_id",
  userAuth,
  removeParticipant
);
router.delete("/webinar/:webinar_id", adminAuth, deleteWebinar);

module.exports = router;
