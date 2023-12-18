const express = require('express');
const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');
require('dotenv').config();

const {
  NODE_ENV, // Access environment variable for determining environment
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
  origin: FRONTEND_URL,
  credentials: true,
}));

// Google Authentication
// Ensure you have a service file that handles this
app.use("/", require("./services/googleAuthentication"));

// Default route
app.get('/', (req, res) => {
  res.send('Welcome');
});

let server;

if (NODE_ENV === 'production') {
  // Production mode: HTTPS server with SSL certificate
  const serverOptions = {
    key: fs.readFileSync(path.join(__dirname, '..', 'ssl_certificates', 'private.key')),
    cert: fs.readFileSync(path.join(__dirname, '..', 'ssl_certificates', 'certificate.crt')),
    ca: fs.readFileSync(path.join(__dirname, '..', 'ssl_certificates', 'ca_bundle.crt'))
  };

  server = https.createServer(serverOptions, app);
} else {
  // Development mode: HTTP server
  server = http.createServer(app);
}

server.on('error', (err) => {
  console.error('Server encountered an error:', err);
});

server.listen(PORT, () => {
  console.log(`Server started in ${NODE_ENV} mode at port: ${PORT}`);
});
