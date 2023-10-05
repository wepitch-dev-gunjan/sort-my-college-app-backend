const express = require('express');
const { getProfile, editProfile, createUser, rescheduleRequest, cancelRequest, saveCounsellor, unsaveCounsellor } = require('../controllers/userController');
const { userAuth } = require('../middlewares/authMiddleware');
const router = express.Router();

// GET
router.get('/:user_id', getProfile);

// PUT
router.put('/:user_id', editProfile);
router.put('/:user_id/counsellor/save', saveCounsellor);
router.put('/:user_id/counsellor/unsave', unsaveCounsellor);

// POST
router.post('/', createUser);
router.post('/seesion/reschedule-request', rescheduleRequest);
router.post('/session/cancel-request', cancelRequest);

module.exports = router;
