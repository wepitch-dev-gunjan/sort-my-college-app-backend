var cloudinary = require("cloudinary").v2;

const cloud_name = process.env.CLOUDINARY_CLOUD_NAME;
const api_key = process.env.CLOUDINARY_API_KEY;
const api_secret = process.env.CLOUDINARY_API_SECRET;

cloudinary.config({
  cloud_name,
  api_key,
  api_secret,
});

const options = {
  use_filename: true,
  unique_filename: true,
  overwrite: false,
};

exports.uploadImage = async (imageBuffer, filename, folderName) => {
  try {
    const options = {
      folder: folderName,
      public_id: filename.substring(0, filename.lastIndexOf(".")), // Set public_id to the filename without extension
      unique_filename: false
    };

    return new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(options, (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result.secure_url);
        }
      }).end(imageBuffer);
    });
  } catch (error) {
    console.error(error);
    throw error; // Re-throw the error to maintain consistent error handling
  }
};

exports.deleteImage = async (url) => {
  try {
    const cloudinaryImage = await cloudinary.uploader.destroy(url)
    if(cloudinaryImage) return {
      message: 'image deleted successfully'
    } 
  } catch (error) {
    return {
      message: 'image not deleted'
    }
  }
}


