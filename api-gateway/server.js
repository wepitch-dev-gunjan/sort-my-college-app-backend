const express = require('express');
const https = require('https');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');
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

const app = express();

const serverOptions = {
  key: fs.readFileSync(path.join(__dirname, '..', 'ssl_certificates', 'private.key')),
  cert: fs.readFileSync(path.join(__dirname, '..', 'ssl_certificates', 'certificate.crt')),
  ca: fs.readFileSync(path.join(__dirname, '..', 'ssl_certificates', 'ca_bundle.crt'))
};

// Proxy configuration
app.use('/user', createProxyMiddleware({ target: `http://127.0.0.1:${USER_PORT}`, changeOrigin: true }));
app.use('/counsellor', createProxyMiddleware({ target: `http://127.0.0.1:${COUNSELLOR_PORT}`, changeOrigin: true }));
app.use('/ep', createProxyMiddleware({ target: `http://127.0.0.1:${ENTRANCE_PREPARATIONS_PORT}`, changeOrigin: true }));
app.use('/vc', createProxyMiddleware({ target: `http://127.0.0.1:${VOCATIONAL_COURSES_PORT}`, changeOrigin: true }));
app.use('/webinars', createProxyMiddleware({ target: `http://127.0.0.1:${WEBINARS_PORT}`, changeOrigin: true }));
app.use('/notification', createProxyMiddleware({ target: `http://127.0.0.1:${NOTIFICATION_SERVICES_PORT}`, changeOrigin: true }));

// Middleware to set CORS headers and allow credentials
app.use(cors({
  origin: 'https://counsellor.sortmycollege.com', // Replace with your Vercel app URL
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
}));

// Google Authentication
app.use("/", require("./services/googleAuthentication"));

// Default route
app.get('/', (req, res) => {
  res.send('Welcome');
});

const httpsServer = https.createServer(serverOptions, app);

httpsServer.on('error', (err) => {
  console.error('HTTPS server encountered an error:', err);
});

httpsServer.listen(PORT, () => {
  console.log('HTTPS server started at port: ' + PORT);
});
