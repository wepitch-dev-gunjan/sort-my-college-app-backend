const { client, messageType } = require('../services/smsService');

exports.sendSMS = async (req, res) => {
  try {
    const { to, message } = req.body;

    client.sms.message((error, responseBody) => {
      if (error === null) {
        console.log("\nResponse body:\n" + JSON.stringify(responseBody));
        res.status(200).send(responseBody);
      } else {
        console.error('Error sending SMS:', error);
        res.status(500).send('Error sending SMS');
      }
    }, to, message, messageType)
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: 'Internal Server Error' });
  }
};

exports.smsCallback = async (req, res) => {
  try {
    console.log('smsCallback')

  } catch (error) {
    console.log(error);
    res.status(500).send({ error: 'Internal Server Error' });
  }
};
