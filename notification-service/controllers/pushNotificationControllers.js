const notifier = require("node-notifier");
const admin = require('../services/firebaseConfig');

exports.sendNotificationToTopic = async (req, res) => {
  const { topic, title, body, type, id, imageUrl } = req.body;

  if (!topic || !title || !body || !type || !id) {
    return res.status(400).json({ error: "Topic, title, body, type, id & imageUrl are required" });
  }

  let message = {
    notification: {
      title: title,
      body: body,
      image: imageUrl
    },
    android: {
      notification: {
        sound: "default"
      }
    },
    apns: {
      payload: {
        aps: {
          sound: "default"
        }
      }
    },
    data: {
      type: type,
      id: id
    },
    topic: topic
  };

  try {
    const response = await admin.messaging().send(message);
    console.log("✅ Notification sent successfully:", response);
    res.status(200).json({ message: "Notification sent successfully", response });
  } catch (error) {
    console.error("❌ Error sending notification:", error.message);
    res.status(500).json({ error: "Error sending notification", details: error.message });
  }
};


exports.postNotification = (req, res) => {
  try {
    const { title, user, sender, message } = req.body;
    notifier.notify(
      {
        title,
        message: `${message} from ${sender}, ${user}`,
        sound: true,
        wait: true,
      },
      function (err, response, metadata) {
        // Response is response from notification
        // Metadata contains activationType, activationAt, deliveredAt
      }
    );

    notifier.on("click", function (notifierObject, options, event) {
      // Triggers if `wait: true` and user clicks notification
      console.log(options);
    });

    notifier.on("timeout", function (notifierObject, options) {
      // Triggers if `wait: true` and notification closes
    });
    res.status(200).send({ message: "Notification sent!" });
  } catch (error) {
    console.log(error);
    res.send({ error: "Internal server error" });
  }
};
