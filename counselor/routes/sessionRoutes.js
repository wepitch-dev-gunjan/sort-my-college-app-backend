const express = require('express');
const { updateSession, bookSession, getSessions } = require('../controllers/sessionController');
const { counsellorAuth } = require('../middlewares/authMiddleware');
const router = express.Router();

// GET
router.get('/session/:counselor_id/sessions', getSessions);

// POST
// router.post('/session', counsellorAuth, addSession);

// PUT
router.put('/session/:counseling_id', updateSession);
router.put('/session/:counseling_id/book', bookSession);
// router.put('/session/:counseling_id/reschedule', rescheduleSession);
// router.put('/session/:counseling_id/cancel', cancelSession);

// DELETE
// router.delete('/session/:session_id', removeSession);

module.exports = router;
