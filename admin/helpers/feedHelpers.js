// // upload.js
// const multer = require('multer');
// const { v4: uuidv4 } = require('uuid');
// // const AWS = require('aws-sdk');
// const Feed = require('../models/Feed');

// const s3CdnBaseUrl = 'https://your-s3-cdn-url/';
// const s3 = new AWS.S3();

// const storage = multer.memoryStorage();

// exports.upload = multer({
//   storage: storage,
//   limits: {
//     fileSize: 1024 * 1024 * 10, // 10 MB limit for videos
//   },
//   fileFilter: (req, file, cb) => {
//     const allowedMimeTypes = ['image/jpeg', 'image/png', 'video/mp4'];

//     if (allowedMimeTypes.includes(file.mimetype)) {
//       cb(null, true);
//     } else {
//       cb(new Error('Invalid file type'));
//     }
//   },
// });

// exports.uploadToS3 = (file) => {
//   return new Promise((resolve, reject) => {
//     const ext = file.originalname.split('.').pop();
//     const filename = `${uuidv4()}.${ext}`;

//     const params = {
//       Bucket: 'your-s3-bucket-name',
//       Key: filename,
//       Body: file.buffer,
//       ContentType: file.mimetype,
//     };

//     s3.upload(params, (err, data) => {
//       if (err) {
//         reject(err);
//       } else {
//         const s3CdnLink = `${s3CdnBaseUrl}${filename}`;
//         resolve(s3CdnLink);
//       }
//     });
//   });
// }

// exports.saveFeedToDatabase = async (feedLink) => {
//   try {
//     const newFeed = new Feed({ feed_link: feedLink });
//     await newFeed.save();
//     return newFeed;
//   } catch (error) {
//     throw error;
//   }
// }