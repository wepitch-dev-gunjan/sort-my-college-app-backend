const notifier = require("node-notifier");
// const path = require('path');

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
