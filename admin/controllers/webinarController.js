const { KJUR } = require('jsrsasign');

require('dotenv').config();

exports.getWebinar = async (req, res) => {
  try {

  } catch (error) {
    console.log(error);
    res.status(500).send({ error: 'Internal Server Error' });
  }
};

exports.getWebinars = async (req, res) => {
  try {

  } catch (error) {
    console.log(error);
    res.status(500).send({ error: 'Internal Server Error' });
  }
};

exports.addWebinar = async (req, res) => {
  try {
    // const { webinar_date, webinar_time, webinar_fee, webinar_available_slots } = req.body;
    // if(!webinar_date ) return res.status(400).send({
    //   error: 'Date is required'
    // })
    const { topic } = req.body;

    // Make a POST request to Zoom API to create a meeting
    const { data } = await axios.post('https://api.zoom.us/v2/users/me/meetings', {
      topic,
      type: 2 // Scheduled meeting
    }, {
      headers: {
        'Authorization': `Bearer YOUR_ZOOM_API_TOKEN`
      }
    });

    res.json(response.data);

    res.status(200).send(data);
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: 'Internal Server Error' });
  }
};

exports.editWebinar = async (req, res) => {
  try {

  } catch (error) {
    console.log(error);
    res.status(500).send({ error: 'Internal Server Error' });
  }
};

exports.deleteWebinar = async (req, res) => {
  try {

  } catch (error) {
    console.log(error);
    res.status(500).send({ error: 'Internal Server Error' });
  }
};

exports.zoomGenerateSignature = (req, res) => {
  try {
    const { meeting_number, role, user_name } = req.body;
    const iat = Math.round(new Date().getTime() / 1000) - 30;
    const exp = iat + 60 * 60 * 2

    const { ZOOM_CLIENT_ID, ZOOM_CLIENT_SECRET } = process.env;

    const oHeader = { alg: 'HS256', typ: 'JWT' }

    const oPayload = {
      sdkKey: ZOOM_CLIENT_ID,
      mn: meeting_number,
      role,
      iat: iat,
      exp: exp,
      appKey: ZOOM_CLIENT_ID,
      tokenExp: iat + 60 * 60 * 2
    }

    const sHeader = JSON.stringify(oHeader)
    const sPayload = JSON.stringify(oPayload)
    const signature = KJUR.jws.JWS.sign('HS256', sHeader, sPayload, ZOOM_CLIENT_SECRET)
    res.status(200).send({
      signature
    })
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: 'Internal Server Error' });
  }
};

// exports.scheduleMeeting = async (req, res) => {
//   try {
//     const { admin_id } = req;
//     const { }
//   } catch (error) {
//     console.log(error)
//     res.status(500).send({
//       error: "Internal server error"
//     })
//   }
// }