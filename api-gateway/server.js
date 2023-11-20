const gateway = require('fast-gateway');
const https = require('https');
const fs = require('fs');
require('dotenv').config();

const {
  PORT,
  USER_PORT,
  COUNSELLOR_PORT,
  ENTRANCE_PREPARATIONS_PORT,
  VOCATIONAL_COURSES_PORT,
  WEBINARS_PORT,
  NOTIFICATION_SERVICES_PORT
} = process.env;

const serverOptions = {
  key: fs.readFileSync('private.key'),
  cert: fs.readFileSync('certificate.crt'),
  ca: fs.readFileSync('ca_bundle.crt')
};

const server = gateway({
  routes: [
    {
      prefix: '/user',
      target: `http://127.0.0.1:${USER_PORT}`
    },
    {
      prefix: '/counsellor',
      target: `http://127.0.0.1:${COUNSELLOR_PORT}`
    },
    {
      prefix: '/ep',
      target: `http://127.0.0.1:${ENTRANCE_PREPARATIONS_PORT}`
    },
    {
      prefix: '/vc',
      target: `http://127.0.0.1:${VOCATIONAL_COURSES_PORT}`
    },
    {
      prefix: '/webinars',
      target: `http://127.0.0.1:${WEBINARS_PORT}`
    },
    {
      prefix: '/notification',
      target: `http://127.0.0.1:${NOTIFICATION_SERVICES_PORT}`
    },
  ]
});

// Middleware to set CORS headers and allow credentials
server.use((req, res, next) => {
  // Set the Access-Control-Allow-Origin to the incoming Origin if using HTTPS
  const origin = req.headers.origin;
  if (origin && origin.startsWith('https://')) {
    res.header('Access-Control-Allow-Origin', origin);
  }

  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  next();
});

server.get('/', (req, res) => {
  res.send('welcome');
});

const httpsServer = https.createServer(serverOptions, server);

httpsServer.on('error', (err) => {
  console.error('HTTPS server encountered an error:', err);
});

httpsServer.listen(PORT, () => {
  console.log('HTTPS server started at port: ' + PORT);
});
