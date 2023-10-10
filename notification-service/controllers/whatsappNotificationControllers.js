const twilio = require('twilio');
require('dotenv').config();
const { TWILIO_AUTH_TOKEN, TWILIO_SID, TWILIO_WHATSAPP_SENDER, TWILIO_SMS_SENDER } = process.env;

const client = twilio(TWILIO_SID, TWILIO_AUTH_TOKEN);

exports.sendWhatsappMessage = async (req, res) => {
  try {
    const { to, message } = req.body;
    const response = await client.messages
      .create({
        body: message,
        from: TWILIO_WHATSAPP_SENDER,
        to: `whatsapp:+91${to}`
      });
    if (!response) return res.status(400).send({ error: "Message not sent" });
    res.status(200).send({ message: "Message sent successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: 'Internal Server Error' });
  }
};

exports.sendSMSMessage = async (req, res) => {
  try {
    const { to, message } = req.body;
    const response = await client.messages
      .create({
        body: message,
        from: TWILIO_SMS_SENDER,
        to
      });
    if (!response) return res.status(400).send({ error: "Message not sent" });
    res.status(200).send({ message: "Message sent successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: 'Internal Server Error' });
  }
};