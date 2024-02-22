const sdk = require('api')('@msg91api/v5.0#6n91xmlhu4pcnz');
require('dotenv').config()

const { MSG91_AUTH_KEY } = prcoess.env;

exports.sendOTPViaSMS = (phoneNumber, otp) => {
  sdk.auth(MSG91_AUTH_KEY);
  sdk.sendSms({
    template_id: 'send-otp',
    short_url: '1 (On) or 0 (Off)',
    recipients: [{ mobiles: phoneNumber, otp }]
  })
    .then(({ data }) => console.log(data))
    .catch(err => console.error(err));
};