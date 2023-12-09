const express = require("express");
const app = express();
require("dotenv").config();
const { readdirSync } = require("fs");
const cors = require("cors");
const { default: mongoose } = require("mongoose");

const PORT = process.env.PORT || 8005;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/sort-my-college';

app.use(express.json());
app.use(cors());

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

readdirSync("./routes").map((r) => app.use("/", require("./routes/" + r)));

app.listen(PORT, () => {
  console.log("Listening on port " + PORT);
});
