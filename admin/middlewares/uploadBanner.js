const multer = require("multer");

const storage = multer.memoryStorage(); // Use memory storage for handling file uploads

const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 5 }, // Limit file size to 5MB
});

const singleUpload = upload.single("image"); // Assuming your form field for the image is named 'image'

module.exports = singleUpload;
