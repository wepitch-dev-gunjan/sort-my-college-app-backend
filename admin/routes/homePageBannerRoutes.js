const express = require('express');
const { createBanner } = require('../controllers/homePageBannerController');
const router = express.Router();

router.post('/home-page-banner', createBanner);

module.exports = router;