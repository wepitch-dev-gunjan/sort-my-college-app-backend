const express = require("express");
const {
  getWebinars,
  getWebinar,
  addWebinar,
  editWebinar,
  deleteWebinar,
  zoomGenerateSignature,
  getSingleWebinar,
} = require("../controllers/webinarController");
const { adminAuth } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/uploadBanner");
const router = express.Router();

router.get("/webinar", getWebinars);
router.post("/webinar/generate-signature", zoomGenerateSignature);
// router.post('/webinar/schedule-webinar', adminAuth, scheduleMeeting)
router.get("/webinar/:webinar_id", getSingleWebinar);

router.post("/webinar", adminAuth, upload.single("webinar_image"), addWebinar);
router.put("/webinar", adminAuth, editWebinar);
router.delete("/webinar/:webinar_id", adminAuth, deleteWebinar);

module.exports = router;
