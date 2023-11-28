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
  NOTIFICATION_SERVICES_PORT,
  FRONTEND_URL
} = process.env;

const app = express();

const serverOptions = {
  key: fs.readFileSync(path.join(__dirname, '..', 'ssl_certificates', 'private.key')),
  cert: fs.readFileSync(path.join(__dirname, '..', 'ssl_certificates', 'certificate.crt')),
  ca: fs.readFileSync(path.join(__dirname, '..', 'ssl_certificates', 'ca_bundle.crt'))
};

// Configure proxy for each service
const proxyConfig = {
  '/user': USER_PORT,
  '/counsellor': COUNSELLOR_PORT,
  '/ep': ENTRANCE_PREPARATIONS_PORT,
  '/vc': VOCATIONAL_COURSES_PORT,
  '/webinars': WEBINARS_PORT,
  '/notification': NOTIFICATION_SERVICES_PORT
};

Object.keys(proxyConfig).forEach(context => {
  app.use(context, createProxyMiddleware({
    target: `http://127.0.0.1:${proxyConfig[context]}`,
    changeOrigin: true,
    pathRewrite: {
      [`^${context}`]: '' // Rewrite the path
    }
  }));
});

// Middleware to set CORS headers and allow credentials
app.use(cors({
  origin: FRONTEND_URL, // Replace with your Vercel app URL
  credentials: true,
}));

// Google Authentication
// Ensure you have a service file that handles this
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
