const cloudinary = require("cloudinary").v2;
const HomePageBanner = require("../models/homePageBanner");
const uploadBanner = require("../middlewares/uploadBanner");
// import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: "drqangxt5",
  api_key: "831579838286736",
  api_secret: "-Lz6ym2YT9sw2HTLm3DCJp8Lmn0",
});
exports.createBanner = async (req, res) => {
  try {
    // Use the upload middleware to handle the file
    uploadBanner(req, res, async (err) => {
      if (err) {
        console.error(err);
        return res.status(500).send({ error: "File upload failed" });
      }

      const { name } = req.body;

      // Access the uploaded file in req.file
      const { buffer } = req.file;

      // Upload image to Cloudinary
      const cloudinaryUpload = await cloudinary.uploader.upload_stream(
        { resource_type: "raw" },
        (error, result) => {
          if (error) {
            console.error(error);
            return res.status(500).send({ error: "Cloudinary upload failed" });
          }

          const newBanner = new HomePageBanner({
            name,
            url: result.secure_url,
          });

          newBanner
            .save()
            .then((data) => {
              res.status(200).send({
                message: "Banner successfully created",
                data,
              });
            })
            .catch((saveError) => {
              console.error(saveError);
              res.status(500).send({ error: "Internal server error" });
            });
        }
      );

      buffer.pipe(cloudinaryUpload);
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal server error" });
  }
};

exports.deleteBanner = async (req, res) => {
  try {
    const { _id } = req.params;

    const banner = await HomePageBanner.findById(_id);

    if (!banner) res.status(400).send({ message: "Banner not found" });

    // Delete image from Cloudinary
    await cloudinary.uploader.destroy(banner.url);

    await HomePageBanner.findByIdAndDelete(_id);

    res.status(200).send({ message: "Banner deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal server error" });
  }
};
