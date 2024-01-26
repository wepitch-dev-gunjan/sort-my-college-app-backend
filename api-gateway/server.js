const express = require('express');
const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');
const socketIo = require('socket.io');
require('dotenv').config();

const {
  NODE_ENV,
  PORT,
  USER_PORT,
  COUNSELLOR_PORT,
  ENTRANCE_PREPARATIONS_PORT,
  VOCATIONAL_COURSES_PORT,
  WEBINARS_PORT,
  NOTIFICATION_SERVICES_PORT,
  FRONTEND_URL,
  ADMIN_PORT,
} = process.env;

const app = express();
const server = NODE_ENV === 'production'
  ? https.createServer({
    key: fs.readFileSync(path.join(__dirname, '..', 'ssl_certificates', 'private.key')),
    cert: fs.readFileSync(path.join(__dirname, '..', 'ssl_certificates', 'certificate.crt')),
    ca: fs.readFileSync(path.join(__dirname, '..', 'ssl_certificates', 'ca_bundle.crt'))
  }, app)
  : http.createServer(app);

const io = socketIo(server, {
  cors: {
    origin: FRONTEND_URL,
    methods: ["GET", "POST"]
  }
});

// Configure proxy for each service
const proxyConfig = {
  '/user': USER_PORT,
  '/counsellor': COUNSELLOR_PORT,
  '/ep': ENTRANCE_PREPARATIONS_PORT,
  '/vc': VOCATIONAL_COURSES_PORT,
  '/webinars': WEBINARS_PORT,
  '/notification': NOTIFICATION_SERVICES_PORT,
  '/admin': ADMIN_PORT
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
app.use("/", require("./services/googleAuthentication"));

// REST API routes
app.get('/', (req, res) => {
  res.send('Welcome to the REST API');
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('A user connected');

  // Example: Broadcast a message to all connected clients
  socket.on('send-message', (msg) => {
    io.emit('chat-message', msg);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

server.on('error', (err) => {
  console.error('Server encountered an error:', err);
});

server.listen(PORT, () => {
  console.log(`Server started in ${NODE_ENV} mode at port: ${PORT}`);
});
