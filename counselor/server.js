const express = require("express");
const app = express();
const mongoose = require("mongoose");
const { readdirSync } = require("fs");
const cors = require("cors");

require("dotenv").config();
const PORT = process.env.PORT || 8001;
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/sort-my-college";

// Parse URL-encoded form data
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// CORS configuration
app.use(cors({
  origin: "https://counsellor.sortmycollege.com",
  credentials: true,
}));

// Connect to MongoDB
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.on("connected", () => {
  console.log("Database is connected");
});

mongoose.connection.on("error", (err) => {
  console.error("MongoDB connection error:", err);
});

// Middleware to set CORS headers and allow credentials
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "https://counsellor.sortmycollege.com");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  next();
});

// Routes
readdirSync("./routes").map((r) => app.use("/", require("./routes/" + r)));
app.use("/", require("./services/googleAuthentication"));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
