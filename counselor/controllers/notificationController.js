const Notification = require("../models/Notification");

exports.createNotification = async (req, res) => {
  try {
    const { counsellor_id } = req;
    const { title, message } = req.body;

    if (!title) return res.status(400).send({
      error: 'Title is required'
    })

    if (!message) return res.status(400).send({
      error: 'Message is required'
    })

    const notification = new Notification({
      counsellor: counsellor_id,
      title,
      message
    });

    const response = await notification.save();
    res.status(200).send(response);
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: 'Internal Server Error' });
  }
};

exports.getNotifications = async (req, res) => {
  try {
    const { counsellor_id } = req;

    const notifications = await Notification.find({ counsellor: counsellor_id });
    if (!notifications) return res.status(404).send({
      error: 'Notifications not found'
    })

    res.status(200).send(notifications);
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: 'Internal Server Error' });
  }
};

exports.updateNotificationStatus = async (req, res) => {
  try {
    const { notification_id } = req.params;
    const { read } = req.body;

    if (!read) {
      return res.status(400).send({
        error: 'Read feild is required'
      });
    }

    const notification = await Notification.findOne({ _id: notification_id });

    if (!notification) {
      return res.status(404).send({
        error: 'Notification not found'
      });
    }

    if (read !== undefined && !notification.read) {
      notification.read = true;
      await notification.save();
    }

    res.status(200).send(notification);
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: 'Internal Server Error' });
  }
};