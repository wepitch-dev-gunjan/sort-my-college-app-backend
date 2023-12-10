const express = require('express');
const { createFeedback, getFeedbacks, getFeedback, editFeedback, deleteFeedback } = require('../controllers/feedbackController');
const router = express.Router();

router.post('/feedback', createFeedback);
router.get('/feedback', getFeedbacks);
router.get('/feedback/:feedback_id', getFeedback);
router.put('/feedback/:feedback_id', editFeedback);
router.delete('/feedback/:feedback_id', deleteFeedback);

module.exports = router;