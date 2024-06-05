const cloudinary = require("cloudinary").v2;

const cloud_name = process.env.CLOUDINARY_CLOUD_NAME;
const api_key = process.env.CLOUDINARY_API_KEY;
const api_secret = process.env.CLOUDINARY_API_SECRET;

// Ensure the Cloudinary configuration is set correctly
cloudinary.config({
  cloud_name,
  api_key,
  api_secret,
});

/**
 * Upload image to Cloudinary
 * @param {Buffer} imageBuffer - The image buffer to upload
 * @param {string} filename - The filename to use
 * @param {string} folderName - The folder to upload to
 * @returns {Promise<string>} - The URL of the uploaded image
 */
exports.uploadImage = async (imageBuffer, filename, folderName) => {
  console.log("Attempting to upload image");

  const options = {
    folder: folderName,
    public_id: filename.substring(0, filename.lastIndexOf(".")), // Set public_id to the filename without extension
    unique_filename: false,
  };

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(options, (error, result) => {
      if (error) {
        console.error("Cloudinary upload error:", error);
        reject(error);
      } else {
        console.log("Cloudinary upload result:", result);
        resolve(result.secure_url);
      }
    });

    uploadStream.end(imageBuffer);
  });
};

/**
 * Delete image from Cloudinary by URL
 * @param {string} url - The URL of the image to delete
 * @returns {Promise<object>} - The result message of the deletion process
 */
exports.deleteImage = async (url) => {
  try {
    const public_id = url.split('/').slice(-1)[0].split('.')[0]; // Extract public_id from the URL
    const result = await cloudinary.uploader.destroy(public_id);

    if (result.result === 'ok') {
      return { message: "Image deleted successfully" };
    } else {
      throw new Error("Image not deleted");
    }
  } catch (error) {
    console.error("Error deleting image from Cloudinary:", error);
    return { message: "Image not deleted", error: error.message };
  }
};
