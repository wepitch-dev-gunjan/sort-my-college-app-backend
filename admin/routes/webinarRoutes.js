const express = require("express");
const {
  getWebinars,
  getWebinar,
  addWebinar,
  editWebinar,
  deleteWebinar,
  zoomGenerateSignature,
  getSingleWebinar,
  getWebinarsForUser,
} = require("../controllers/webinarController");
const { adminAuth, userAuth } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/uploadBanner");
const router = express.Router();

router.get("/webinar", getWebinars);
router.get("/webinar/webinars-for-user", userAuth, getWebinarsForUser);
router.post("/webinar/generate-signature", zoomGenerateSignature);
router.get("/webinar/:webinar_id", getSingleWebinar);

router.post("/webinar", adminAuth, upload.single("webinar_image"), addWebinar);
router.put("/webinar", adminAuth, editWebinar);
router.delete("/webinar/:webinar_id", adminAuth, deleteWebinar);

module.exports = router;
