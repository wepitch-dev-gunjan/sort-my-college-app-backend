const Notification = require('../models/Notification');

exports.createNotification = async (req, res) => {
  try {
    const { user_id, title, message } = req.body;

    if (!title || !message) {
      return res.status(400).json({ error: 'Title and message are required fields.' });
    }

    const newNotification = new Notification({
      user_id,
      title,
      message,
    });

    // Save the notification to the database
    await newNotification.save();

    return res.status(201).json({
      message: 'Notification created successfully.',
      notification: newNotification,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getNotifications = async (req, res) => {
  try {
    const { user_id } = req.query;

    // Fetch all notifications for the user from the database
    const notifications = await Notification.find({ user_id });

    return res.status(200).json({
      message: 'Notifications retrieved successfully.',
      notifications,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getNotification = async (req, res) => {
  try {
    const { user_id } = req.query;
    const { notification_id } = req.params;

    // Fetch a specific notification for the user by ID from the database
    const notification = await Notification.findOne({ _id: notification_id, user_id });

    // Check if the notification exists
    if (!notification) {
      return res.status(404).json({ error: 'Notification not found.' });
    }

    return res.status(200).json({
      message: 'Notification retrieved successfully.',
      notification,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.readNotification = async (req, res) => {
  try {
    const { user_id } = req.query;
    const { notification_id } = req.params;
    const notification = await Notification.findOneAndUpdate({ _id: notification_id, user_id }, { read: true })

    if (!notification) return res.status(404).send({
      error: "Notification not found"
    })

    res.status(200).send({
      message: "Notification read",
      notification
    })
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: 'Internal Server Error' });
  }
};

exports.deleteNotifications = async (req, res) => {
  try {
    const { user_id } = req.query;

    // Validate user_id
    if (!user_id) {
      return res.status(400).json({ error: 'User ID is required.' });
    }

    // Delete notifications where user_id matches and read is true
    const result = await Notification.deleteMany({ user_id, read: true });

    return res.status(200).json({
      message: 'Notifications deleted successfully.',
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
