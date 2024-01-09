const express = require("express");
const { createWebinar, getWebinars, getWebinar, deleteWebinar, editWebinar, getWebinarsForAdmin } = require("../controllers/webinarControllers");
const { adminOrUserAuth, adminAuth } = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/", adminAuth, createWebinar);
router.get("/", getWebinars);
router.get("/:webinar_id", adminOrUserAuth, getWebinar);
router.get("/:webinar_id/get-webinars-for-admin", adminAuth, getWebinarsForAdmin);
router.delete("/:webinar_id", deleteWebinar);
router.put("/:webinar_id", editWebinar);

module.exports = router;
