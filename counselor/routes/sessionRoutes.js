const express = require('express');
const { updateSession, bookSession, getSessions, addSession, getSession } = require('../controllers/sessionController');
const { counsellorAuth } = require('../middlewares/authMiddleware');
const { rescheduleSession, cancelSession } = require('../controllers/counsellorController');
const router = express.Router();

// GET
router.get('/:counsellor_id/sessions', getSessions);
router.get('/sessions/:session_id', getSession);

// POST
router.post('/sessions', addSession);

// PUT
router.put('/sessions/:session_id', updateSession);
router.put('/sessions/:session_id/book', bookSession);
router.put('/sessions/:session_id/reschedule', rescheduleSession);
router.put('/counsellor/sessions/:session_id/cancel', cancelSession);
// router.put('/session/:counseling_id/reschedule', rescheduleSession);
// router.put('/session/:counseling_id/cancel', cancelSession);

// DELETE
// router.delete('/session/:session_id', removeSession);

module.exports = router;
