const express = require('express');
const router = express.Router();
const { getCounsellors, getSingleCounsellor, createCounsellor, getProfile, editProfile } = require('../controllers/counsellorController');
const { counsellorAuth } = require('../middlewares/authMiddleware');

// user authorised routes
// GET
// router.get('/:counselor_id', getSingleCounsellor);
// router.get('/', getCounsellors);

// counsellor authorised routes
router.get('/', counsellorAuth, getProfile);
// PUT
router.put('/', counsellorAuth, editProfile);



module.exports = router;
