const express = require('express');
const { userAuth, counsellorAuth } = require('../middlewares/authMiddleware');
const { followCounsellor, unfollowCounsellor, getFollowers, getFollowersCount } = require('../controllers/followerController');
const router = express.Router();

router.post('/follower', userAuth, followCounsellor);
router.put('/follower/:counsellor_id', userAuth, unfollowCounsellor);
router.get('/follower', counsellorAuth, getFollowers);
router.get('/follower/followers-count', counsellorAuth, getFollowersCount);

module.exports = router;