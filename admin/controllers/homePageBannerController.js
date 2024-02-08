const cloudinary = require("cloudinary").v2;
const HomePageBanner = require("../models/homePageBanner");
const uploadBanner = require("../middlewares/uploadBanner");
const { uploadMultipleImages } = require("../services/cloudinary");
const uploadImage = require("../services/cloudinary");
// import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: "drqangxt5",
  api_key: "831579838286736",
  api_secret: "-Lz6ym2YT9sw2HTLm3DCJp8Lmn0",
});

exports.createBanner = async (req, res) => {
  try {
    const { files } = req;
    if (!files || !files.length) {
      return res.status(400).json({ error: "No files uploaded" });
    }

    let result;
    if (files.length === 1) {
      console.log(files[0])
      result = await uploadImage(files[0].buffer);
    } else {
      result = await uploadMultipleImages(files);
    }

    res.json({
      urls: Array.isArray(result) ? result : [result],
    });
  } catch (error) {
    console.error("Error creating banner:", error);
    res.status(500).json({ error: "Internal server error" });
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
