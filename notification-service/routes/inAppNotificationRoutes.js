const express = require('express');
const { createNotification, getNotifications, getNotification, readNotification, deleteNotifications } = require('../controllers/inAppNotificationController');
const router = express.Router();

router.post('/', createNotification)
router.get('/', getNotifications)
router.get('/:notification_id', getNotification);
router.put('/:notification_id', readNotification);
router.delete('/', deleteNotifications);

module.exports = router;