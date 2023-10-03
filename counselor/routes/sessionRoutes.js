const express = require('express');
const { updateSession, bookSession, getSessions, addSession, getSession } = require('../controllers/sessionController');
const { counsellorAuth } = require('../middlewares/authMiddleware');
const router = express.Router();

// GET
router.get('/sessions', counsellorAuth, getSessions);
router.get('/sessions/:session_id', counsellorAuth, getSession);

// POST
router.post('/sessions', counsellorAuth, addSession);

// PUT
router.put('/sessions/:session_id', counsellorAuth, updateSession);
router.put('/sessions/:counseling_id/book', bookSession);
// router.put('/session/:counseling_id/reschedule', rescheduleSession);
// router.put('/session/:counseling_id/cancel', cancelSession);

// DELETE
// router.delete('/session/:session_id', removeSession);

module.exports = router;
