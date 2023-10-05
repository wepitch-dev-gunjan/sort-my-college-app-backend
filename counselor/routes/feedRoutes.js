const express = require('express');
const { getFeeds, getFeedComments, getFeed, unlikeFeed, saveFeed, unsaveFeed, likeFeed, postFeedComment, createFeed } = require('../controllers/counsellorController');
const router = express.Router();

// GET
router.get('/:counsellor_id/feed', getFeeds);
router.get('/feed/:feed_id', getFeed);
router.get('/feed/:feed_id/comments', getFeedComments);

// PUT
router.put('/feed/:feed_id/unlike', unlikeFeed);
router.put('/feed/:feed_id/save', saveFeed);
router.put('/feed/:feed_id/unsave', unsaveFeed);

// POST
router.post('/feed/', createFeed);
router.post('/feed/:feed_id/like', likeFeed);
router.post('/feed/:feed_id/comments', postFeedComment);

module.exports = router;