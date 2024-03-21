const express = require("express");
const {
  createBanner,
  getBanners,
  deleteBanner,
} = require("../controllers/homePageBannerController");
const upload = require("../middlewares/uploadBanner"); // Import the updated upload middleware
const { adminAuth } = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/home-page-banner", upload.single('banner'), createBanner);
router.get('/home-page-banner', getBanners);
router.delete("/home-page-banner/:_id", deleteBanner);

module.exports = router;
