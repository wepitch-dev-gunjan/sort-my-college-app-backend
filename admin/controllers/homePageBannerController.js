const cloudinary = require("cloudinary").v2;
const HomePageBanner = require("../models/homePageBanner");
const uploadBanner = require("../middlewares/uploadBanner");
const { uploadMultipleImages } = require("../services/cloudinary");
const { uploadImage, deleteImage } = require("../services/cloudinary");
const homePageBanner = require("../models/homePageBanner");
// import { v2 as cloudinary } from "cloudinary";

exports.createBanner = async (req, res) => {
  try {
    const { file } = req;
    if (!file) {
      return res.status(400).send({
        error: "File can't be empty",
      });
    }

    const fileName = `banner-image-${Date.now()}.jpeg`;
    const folderName = "banner-images";

    const banner_image = await uploadImage(file.buffer, fileName, folderName);

    const banner = new homePageBanner({
      url: banner_image,
    });

    await banner.save();
    res.json(banner);
  } catch (error) {
    console.error("Error creating banner:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getBanners = async (req, res) => {
  try {
    const { page, limit } = req.query;
    const query = {};
    const { permissions } = req;

    // Fetch banners sorted by date in descending order
    const banners = await homePageBanner.find().sort({ createdAt: -1 });

    if (!banners || banners.length === 0) {
      return res.status(404).send([]);
    }

    res.status(200).send(banners);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

exports.deleteBanner = async (req, res) => {
  try {
    const { _id } = req.params;

    const banner = await HomePageBanner.findById(_id);

    if (!banner) return res.status(400).send({ message: "Banner not found" });

    await deleteImage(banner.url);

    await HomePageBanner.findByIdAndDelete(_id);

    res.status(200).send({ message: "Banner deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal server error" });
  }
};
