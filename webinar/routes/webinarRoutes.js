const express = require("express");
const { createWebinar, getWebinars, getWebinar, deleteWebinar, editWebinar } = require("../controllers/webinarControllers");
const router = express.Router();

router.post("/webinar", createWebinar);
router.get("/webinar", getWebinars);
router.get("/webinar/:webinar_id", getWebinar);
router.delete("/webinar/:webinar_id", deleteWebinar);
router.put("/webinar/:webinar_id", editWebinar);

module.exports = router;
