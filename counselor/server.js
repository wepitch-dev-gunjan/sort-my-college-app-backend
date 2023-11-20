const path = require('path');
const https = require('https');
const fs = require('fs');
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const { readdirSync } = require('fs');
const cors = require('cors');
const cookieParser = require('cookie-parser');

require('dotenv').config();
const PORT = process.env.PORT || 8001;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/sort-my-college';

// Parse URL-encoded form data
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());

// CORS configuration
app.use(
  cors({
    origin: 'https://counsellor.sortmycollege.com',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  })
);

// Connect to MongoDB
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.on('connected', () => {
  console.log('Database is connected');
});

mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

// Routes
readdirSync('./routes').map((r) => app.use('/', require('./routes/' + r)));
app.use('/', require('./services/googleAuthentication'));


const serverOptions = {
  key: fs.readFileSync(path.join(__dirname, '..', 'ssl_certificates', 'private.key')),
  cert: fs.readFileSync(path.join(__dirname, '..', 'ssl_certificates', 'certificate.crt')),
  ca: fs.readFileSync(path.join(__dirname, '..', 'ssl_certificates', 'ca_bundle.crt'))
};

const httpsServer = https.createServer(serverOptions, app);

httpsServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
