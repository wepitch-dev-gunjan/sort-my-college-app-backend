const express = require("express");
const {
  getWebinars,
  getWebinar,
  addWebinar,
  editWebinar,
  deleteWebinar,
  zoomGenerateSignature,
} = require("../controllers/webinarController");
const { adminAuth } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/uploadBanner");
const router = express.Router();

router.get("/webinar", getWebinars);
router.post("/webinar/generate-signature", zoomGenerateSignature);
// router.post('/webinar/schedule-webinar', adminAuth, scheduleMeeting)
router.get("/webinar/:webinar_id", getWebinar);
router.post("/webinar", adminAuth, upload.single("webinar_image"), addWebinar);
router.put("/webinar", adminAuth, editWebinar);
router.delete("/webinar", adminAuth, deleteWebinar);

module.exports = router;
