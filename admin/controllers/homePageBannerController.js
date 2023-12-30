const HomePageBanner = require("../models/homePageBanner");

exports.createBanner = async (req, res) => {
  try {
    const { name, url } = req.body;

    const newBanner = new HomePageBanner({
      name,
      url,
    });

    const data = await newBanner.save();

    res.status(200).send({
      message: "Banner successfully created",
      data,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal server error" });
  }
};

exports.deleteBanner = async (req, res) => {
  try {
    const { _id } = req.params;

    const banner = await HomePageBanner.findByIdAndDelete(_id);

    if (!banner) res.status(400).send({ message: "Banner not found" });

    res.status(200).send({ message: "Banner deleted successfully" });

    res.status(200).send({
      message: "Banner successfully deleted",
      data,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal server error" });
  }
};
