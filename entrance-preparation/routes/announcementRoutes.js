const express = require("express");
const {
  epAuth,
  adminAuth,
  userAuth,
} = require("../middlewares/authMiddleware");

const {
  getAnnouncements,
  addAnnouncements,
  deleteAnnouncement,
  getAnnouncementsForUsers,
} = require("../controllers/announcementControllers");
const router = express.Router();

// EP Panel Routes
router.get("/announcements", epAuth, getAnnouncements);
router.post("/announcements", epAuth, addAnnouncements);
router.delete("/announcements/:announcement_id", epAuth, deleteAnnouncement);

// ep for user
router.get(
  "/announcements-for-user/:institute_id",
  userAuth,
  getAnnouncementsForUsers
);

module.exports = router;
