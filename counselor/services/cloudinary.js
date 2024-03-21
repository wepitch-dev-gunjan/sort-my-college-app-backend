const cloudinary = require("cloudinary").v2;
require('dotenv').config();

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

// const uploadImage = async (imageBuffer) => {
//   return new Promise((resolve, reject) => {
//     cloudinary.uploader.upload_stream(opts, async (error, result) => {
//       try {
//         if (result && result.secure_url) {
//           // create a banner document and store the url
//           return resolve(result.secure_url);
//         }
//       } catch (error) {
//         console.log(error)
//       }

//       console.log(error.message);
//       return reject({ message: error.message });
//     }).end(imageBuffer);
//   });
// };

// module.exports = (image) => {
//   //imgage = > base64
//   return new Promise((resolve, reject) => {
//     cloudinary.uploader.upload(image, opts, (error, result) => {
//       if (result && result.secure_url) {
//         console.log(result.secure_url);
//         return resolve(result.secure_url);
//       }
//       console.log(error.message);
//       return reject({ message: error.message });
//     });
//   });
// };

// module.exports.uploadMultipleImages = (images) => {
//   return new Promise((resolve, reject) => {
//     const uploads = images.map((base) => uploadImage(base));
//     Promise.all(uploads)
//       .then((values) => resolve(values))
//       .catch((err) => reject(err));
//   });
// };

// module.exports = { uploadImage, cloudinary };


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
          console.error(error);
          reject(error);
        } else {
          console.log(result);
          resolve(result.secure_url);
        }
      }).end(imageBuffer);
    });
  } catch (error) {
    console.error(error);
    throw error; // Re-throw the error to maintain consistent error handling
  }
};


