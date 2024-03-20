const express = require('express');
const { sendSMS, smsCallback } = require('../controllers/smsNotificationController');
const router = express.Router();

router.post('/sms-notification/sendSMS', sendSMS);
router.post('/sms-notification/smsCallback', smsCallback);

module.exports = router;