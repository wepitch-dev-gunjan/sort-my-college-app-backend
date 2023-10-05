const express = require('express');
const { editFeedComment, hideFeedComment, unhideFeedComment, deleteFeedComment } = require('../controllers/counsellorController');
const router = express.Router();

// PUT
router.put('/counsellor/comment/:comment_id', editFeedComment);
router.put('/counsellor/comment/:comment_id/hide', hideFeedComment);
router.put('/counsellor/comment/:comment_id/unhide', unhideFeedComment);

router.delete('/counsellor/comment/:comment_id', deleteFeedComment)
module.exports = router;