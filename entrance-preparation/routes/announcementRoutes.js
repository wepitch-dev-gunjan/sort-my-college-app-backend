const express = require("express");
const {
    epAuth,
    adminAuth,
    userAuth
} = require("../middlewares/authMiddleware");

const {
    getAnnouncements,
    addAnnouncements
} = require("../controllers/announcementControllers")
const router = express.Router();

// EP Panel Routes
router.get("/announcements", epAuth, getAnnouncements);
router.post("/announcements", epAuth, addAnnouncements);

module.exports = router;