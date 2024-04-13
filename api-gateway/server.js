const express = require("express");
const http = require("http");
const https = require("https");
const fs = require("fs");
const path = require("path");
const cors = require("cors");
const { createProxyMiddleware } = require("http-proxy-middleware");
const socketIo = require("socket.io");
const { datacatalog_v1 } = require("googleapis");
require("dotenv").config();

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
const server =
  NODE_ENV === "production"
    ? https.createServer(
      {
        key: fs.readFileSync(
          path.join(__dirname, "..", "ssl_certificates", "private.key")
        ),
        cert: fs.readFileSync(
          path.join(__dirname, "..", "ssl_certificates", "certificate.crt")
        ),
        ca: fs.readFileSync(
          path.join(__dirname, "..", "ssl_certificates", "ca_bundle.crt")
        ),
      },
      app
    )
    : http.createServer(app);

const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// Configure proxy for each service
const proxyConfig = {
  "/user": USER_PORT,
  "/counsellor": COUNSELLOR_PORT,
  "/ep": ENTRANCE_PREPARATIONS_PORT,
  "/vc": VOCATIONAL_COURSES_PORT,
  "/webinars": WEBINARS_PORT,
  "/notification": NOTIFICATION_SERVICES_PORT,
  "/admin": ADMIN_PORT,
};

Object.keys(proxyConfig).forEach((context) => {
  app.use(
    context,
    createProxyMiddleware({
      target: `http://127.0.0.1:${proxyConfig[context]}`,
      changeOrigin: true,
      pathRewrite: {
        [`^${context}`]: "", // Rewrite the path
      },
    })
  );
});

// Middleware to set CORS headers and allow credentials
app.use(
  cors({
    origin: "*",
    // origin: FRONTEND_URL,
    credentials: true,
  })
);


// Google Authentication
app.use("/", require("./services/googleAuthentication"));

// REST API routes
app.get("/", (req, res) => {
  res.send("Welcome to the REST API");
});

// Socket.IO connection handling
io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("join", (userId) => {
    // Create a private room for the user
    console.log(userId);
    socket.join(userId);
  });

  // Example: Broadcast a message to all connected clients
  socket.on("send-message", (data) => {
    const { room_id, message } = data;
    io.to(room_id).emit("chat-message", message);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

server.on("error", (err) => {
  console.error("Server encountered an error:", err);
});

server.listen(PORT, () => {
  console.log(`Server started in ${NODE_ENV} mode at port: ${PORT}`);
});
