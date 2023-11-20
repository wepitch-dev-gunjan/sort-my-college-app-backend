const gateway = require('fast-gateway');
const https = require('https');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
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
  key: fs.readFileSync(path.join(__dirname, '..', 'ssl_certificates', 'private.key')),
  cert: fs.readFileSync(path.join(__dirname, '..', 'ssl_certificates', 'certificate.crt')),
  ca: fs.readFileSync(path.join(__dirname, '..', 'ssl_certificates', 'ca_bundle.crt'))
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
server.use(
  cors({
    origin: 'https://counsellor.sortmycollege.com', // Replace with your Vercel app URL
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // Allows cookies and authorization headers
  })
);

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
