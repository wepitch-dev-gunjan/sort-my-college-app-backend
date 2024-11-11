const express = require("express");
const { createAccommodationFeedback } = require("../controllers/accommodationFeedbackController");
const { userAuthNew } = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/create-accommodation-feedback", userAuthNew, createAccommodationFeedback);

module.exports = router;