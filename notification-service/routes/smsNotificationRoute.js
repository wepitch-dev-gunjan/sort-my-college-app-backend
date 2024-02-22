const express = require('express');
const { sendSMS } = require('../controllers/smsNotificationController');
const router = express.Router();

router.post('/sms-notification/sendSMS', sendSMS);

module.exports = router;