const sdk = require('api')('@msg91api/v5.0#6n91xmlhu4pcnz');

require('dotenv').config();
const { MSG91_AUTH_KEY } = process.env;

sdk.auth(MSG91_AUTH_KEY);

module.exports = sdk;