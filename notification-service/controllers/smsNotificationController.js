const sdk = require('api')('@msg91api/v5.0#6n91xmlhu4pcnz');
require('dotenv').config();
const { MSG91_AUTH_KEY } = process.env;

sdk.auth(MSG91_AUTH_KEY);
console.log(sdk.auth(MSG91_AUTH_KEY))
exports.sendSMS = async (req, res) => {
  try {
    const { to, message } = req.body;
    const sms = await sdk.sendSms({
      template_id: "658bf380d6fc057df8195742",
      short_url: '1', // Adjust this based on your preference
      recipients: [{ mobiles: [to], otp: message }] // Adjust the recipients structure
    });
    console.log(sms); // Log the response for debugging purposes
    res.status(200).send({ message: "Message sent successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: 'Internal Server Error' });
  }
};
