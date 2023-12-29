const express = require('express');
const app = express();
const mongoose = require('mongoose');
const { readdirSync } = require('fs')
require('dotenv').config();
const PORT = process.env.PORT || 8006
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/sort-my-college';

// Middleware to parse JSON data in the request body
app.use(express.json());

// Connect to MongoDB
mongoose.connect(MONGODB_URI);

mongoose.connection.on('connected', () => {
  console.log('Database is connected');
});

mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

//routes
readdirSync('./routes').map(r => app.use('/', require('./routes/' + r)))

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
