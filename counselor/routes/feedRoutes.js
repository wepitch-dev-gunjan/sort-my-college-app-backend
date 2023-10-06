const express = require('express');
const { getFeeds, getFeedComments, getFeed, unlikeFeed, saveFeed, unsaveFeed, likeFeed, postFeedComment, createFeed, editFeed, deleteFeed, getLikes, hideFeed, unhideFeed } = require('../controllers/counsellorController');
const router = express.Router();

// GET
router.get('/:counsellor_id/feed', getFeeds);
router.get('/feed/:feed_id', getFeed);
router.get('/feed/:feed_id/likes', getLikes);
router.get('/feed/:feed_id/comments', getFeedComments);

// PUT
router.put('/feed/:feed_id', editFeed);
router.put('/feed/:feed_id/hide', hideFeed);
router.put('/feed/:feed_id/unhide', unhideFeed);
router.put('/feed/:feed_id/like', likeFeed);
router.put('/feed/:feed_id/unlike', unlikeFeed);
router.put('/feed/:feed_id/save', saveFeed);
router.put('/feed/:feed_id/unsave', unsaveFeed);

// POST
router.post('/:counsellor_id/feed', createFeed);
router.post('/feed/:feed_id/comment', postFeedComment);

// DELETE
router.delete('/feed/:feed_id', deleteFeed);

module.exports = router;