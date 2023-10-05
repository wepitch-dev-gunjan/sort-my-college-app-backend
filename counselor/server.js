const express = require('express');
const app = express();
const mongoose = require('mongoose');
const { readdirSync } = require('fs');
const cors = require('cors');

require('dotenv').config();
const { PORT, MONGODB_URI } = process.env;
const { PORT } = process.env.PORT;

// Parse URL-encoded form data
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// security options
app.use(cors())

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

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
