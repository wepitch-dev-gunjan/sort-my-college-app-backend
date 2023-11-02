const express = require('express');
const router = express.Router();
const { getCounsellors, editProfile, followCounsellor, unfollowCounsellor, postReviewCounsellor, getCounsellor, getFollowers, getReviewsCounsellor, createCounsellor, getProfilePic, uploadProfilePic, deleteProfilePic, getTotalRatings, deleteCounsellor } = require('../controllers/counsellorController');
const { counsellorAuth } = require('../middlewares/authMiddleware');

// GET
router.get('/', getCounsellors);
router.get('/:counsellor_id', getCounsellor);
router.get('/:counsellor_id/followers', getFollowers);
router.get('/:counsellor_id/profile-pic', getProfilePic);
router.get('/:counsellor_id/review', getReviewsCounsellor);
router.get('/:counsellor_id/total-ratings', getTotalRatings);

// PUT
router.put('/', editProfile);
router.put('/:counsellor_id/follow', followCounsellor);
router.put('/:counsellor_id/unfollow', unfollowCounsellor);

// POST
router.post('/', createCounsellor);
router.post('/:counsellor_id/review', postReviewCounsellor);
router.post('/:counsellor_id/profile-pic', uploadProfilePic);

// DELETE
router.delete('/:counsellor_id/profile-pic', deleteProfilePic);
router.delete('/:counsellor_id', deleteCounsellor);

module.exports = router;