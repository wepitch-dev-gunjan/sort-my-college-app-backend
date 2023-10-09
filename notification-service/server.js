const express = require("express");
const app = express();
require("dotenv").config();
const { readdirSync } = require("fs");
const cors = require("cors");

const PORT = process.env.PORT || 8005;

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
  res.send('welcome to smcapp notification service')
})

readdirSync("./routes").map((r) => app.use("/", require("./routes/" + r)));

app.listen(PORT, () => {
  console.log("Listening on port " + PORT);
});
