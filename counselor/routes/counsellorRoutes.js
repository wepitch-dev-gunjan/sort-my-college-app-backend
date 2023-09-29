const express = require('express');
const router = express.Router();
const { getCounsellors, getSingleCounsellor, createCounsellor, getProfile, editProfile } = require('../controllers/counsellorController');
const { counsellorAuth } = require('../middlewares/authMiddleware');

// GET
// router.get('/', getCounsellors);
router.get('/', counsellorAuth, getProfile);
router.get('/:counselor_id', getSingleCounsellor);

// POST
router.post('/', createCounsellor);

// PUT
router.put('/', counsellorAuth, editProfile);

module.exports = router;
