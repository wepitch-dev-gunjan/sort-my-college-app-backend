const express = require('express');
const router = express.Router();
const { createNotification, getNotifications, updateNotificationStatus } = require("../controllers/notificationController");
const { counsellorAuth } = require("../middlewares/authMiddleware");

router.post('/counsellor/:counsellor_id/notification', createNotification);
router.get('/counsellor/:counsellor_id/notification', counsellorAuth, getNotifications);
router.put('/counsellor/notification/:notification_id', counsellorAuth, updateNotificationStatus);

module.exports = router;