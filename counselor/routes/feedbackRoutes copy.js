const express = require('express');
const { createFeedback, getFeedbacks, getFeedback, editFeedback, deleteFeedback } = require('../controllers/feedbackController');
const { userAuth, counsellorAuth } = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/feedback', userAuth, createFeedback);
router.get('/feedback/getall', getFeedbacks);
router.get('/feedback/:feedback_id', getFeedback);
router.put('/feedback/:feedback_id', editFeedback);
router.delete('/feedback/:feedback_id', deleteFeedback);

module.exports = router;