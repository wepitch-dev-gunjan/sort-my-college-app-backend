const multer = require('multer');

// Set storage engine
const storage = multer.memoryStorage(); // To store files in memory (buffer)

// Initialize Multer
exports.upload = multer({ storage: storage });