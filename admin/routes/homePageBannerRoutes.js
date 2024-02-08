const express = require("express");
const {
  createBanner,
  deleteBanner,
} = require("../controllers/homePageBannerController");
const upload = require("../middlewares/uploadBanner"); // Import the updated upload middleware
const router = express.Router();

router.post("/home-page-banner", upload.array('images'), createBanner); // Use upload middleware with array function for multiple image uploads
router.delete("/home-page-banner/:_id", deleteBanner);

module.exports = router;
