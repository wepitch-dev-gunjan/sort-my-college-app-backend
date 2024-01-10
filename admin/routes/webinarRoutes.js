const express = require('express');
const { getWebinars, getWebinar, addWebinar, editWebinar, deleteWebinar } = require('../controllers/webinarController');
const { adminAuth } = require('../middlewares/authMiddleware');
const router = express.Router();

router.get('/webinar', getWebinars)
router.get('/webinar/:webinar_id', getWebinar)
router.post('/webinar', adminAuth, addWebinar)
router.put('/webinar', adminAuth, editWebinar);
router.delete('/webinar', adminAuth, deleteWebinar);

module.exports = router;