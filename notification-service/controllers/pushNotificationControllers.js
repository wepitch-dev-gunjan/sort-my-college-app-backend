const notifier = require("node-notifier");
const admin = require('../services/firebaseConfig');

//==========================! Send notification with token !===========================

exports.sendNotificationToTopic = async (req, res) => {
  const { topic, title, body, type, id, imageUrl } = req.body;

  if (!topic || !title || !body) {
    return res.status(400).json({ error: "Topic, title, & body are required" });
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

//========================! Send Notification with singleToken !==========================

exports.sendNotificationToToken = async (req, res) => {
  const { token, title, body, type, id } = req.body;

  if (!token || !title || !body || !type || !id) {
    return res.status(400).json({ error: "Token, title, body, type & id are required" });
  }

  let message = {
    notification: {
      title: title,
      body: body
    },
    data: {
      type: type,
      id: id
    },
    token: token
  };

  try {
    const response = await admin.messaging().send(message);
    console.log("Notification sent successfully:", response);
    res.status(200).json({ message: "Notification sent successfully", response });
  } catch (error) {
    console.error("Error sending notification:", error.message);
    res.status(500).json({ error: "Error sending notification", details: error.message });
  }
};

//=============================! Send Notification With MultiTokens !============================

exports.sendNotificationToMultipleTokens = async (req, res) => {
  try {
    const { tokens, title, body, type, id } = req.body;

    // Validate input
    if (!tokens || !title || !body || !type || !id) {
      return res.status(400).json({ error: "Tokens, title, body, type & id are required" });
    }

    // Ensure tokens is an array
    const tokenArray = Array.isArray(tokens) ? tokens : [tokens];

    if (tokenArray.length === 0) {
      return res.status(400).json({ error: "At least one valid token is required" });
    }

    const message = {
      notification: { title, body },
      android: {
        notification: {
          sound: "default",
          channelId: "session_reminder"
        }
      },
      apns: {
        payload: {
          aps: {
            sound: "default"
          }
        }
      },
      data: { type, id, channelId: "session_reminder" },
      tokens: tokenArray
    };

    const response = await admin.messaging().sendEachForMulticast(message);

    // Get success and failure details
    const failedTokens = tokenArray.filter((_, idx) => !response.responses[idx].success);

    res.status(200).json({
      message: "Notifications sent successfully",
      successCount: response.successCount,
      failureCount: response.failureCount,
      failedTokens
    });

  } catch (error) {
    console.error("Error sending notifications:", error);
    res.status(500).json({ error: "Error sending notifications", details: error.message });
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



