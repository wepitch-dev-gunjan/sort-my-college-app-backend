const express = require('express');
const { editFeedComment, hideFeedComment, unhideFeedComment, deleteFeedComment } = require('../controllers/counsellorController');
const router = express.Router();

// PUT
router.put('/comment/:comment_id', editFeedComment);
router.put('/comment/:comment_id/hide', hideFeedComment);
router.put('/comment/:comment_id/unhide', unhideFeedComment);

router.delete('/comment/:comment_id', deleteFeedComment)
module.exports = router;