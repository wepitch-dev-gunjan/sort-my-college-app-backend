const { client, messageType, smsCallback } = require('../services/smsService');

exports.sendSMS = async (req, res) => {
  try {
    const { to, message } = req.body;
    await client.sms.message(smsCallback, to, message, messageType);
    res.status(200).send({ message: "Message sent successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: 'Internal Server Error' });
  }
};
