const express = require("express");
const {
  createBanner,
  deleteBanner,
} = require("../controllers/homePageBannerController");
const router = express.Router();

router.post("/home-page-banner", createBanner);
router.delete("/home-page-banner/:_id", deleteBanner);

module.exports = router;
