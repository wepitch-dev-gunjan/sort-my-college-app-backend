const { default: mongoose } = require("mongoose");
const KeyFeaturesAdmin = require("../models/keyFeaturesAdmin");
const { uploadImage, deleteImage } = require("../services/cloudinary");
const axios = require("axios");
require("dotenv").config();
const { BACKEND_URL } = process.env;

exports.getKeyFeaturesAdmin = async (req, res) => {
  try {
    // Find key features associated with the institute
    const keyFeaturesAdmin = await KeyFeaturesAdmin.find();

    if (!keyFeaturesAdmin) {
      return res.status(404).json({ message: "Key features not found" });
    }

    // If key features are found, return them
    res.status(200).json(keyFeaturesAdmin);
  } catch (error) {
    console.error("Error fetching Key Features: ", error);
    res.status(500).json({ message: "Internal Server Error!!" });
  }
};

exports.getRemainingKeyFeaturesForInstitute = async (req, res) => {
  try {
    const { institute_id } = req; // Assuming you're storing institute_id in req.user from authentication middleware

    if (!institute_id) {
      return res
        .status(400)
        .json({ message: "Missing institute_id in request." });
    }

    const response = await axios.get(
      `${BACKEND_URL}/ep/admin/key-features/${institute_id}`
    );
    const existing_key_features_ids = response.data;
    const all_key_features = await KeyFeaturesAdmin.find();
    const remaining_key_features = all_key_features.filter(keyFeature => {
      return !existing_key_features_ids.includes(keyFeature.id); // Assuming each key feature object has an 'id' property
    });
    
    if (remaining_key_features.length === 0) {
      return res.status(200).json(all_key_features);
    }
    res.status(200).json(remaining_key_features);
  } catch (error) {
    console.error("Error fetching Key Features From Institute: ", error);
    if (error.response && error.response.data) {
      return res.status(error.response.status || 500).json(error.response.data);
    }
    res.status(500).json({ message: "Internal Server Error!!" });
  }
};

exports.addKeyFeatureAdmin = async (req, res) => {
  try {
    const { name } = req.body;
    const { file } = req;

    if (!name) {
      return res.status(400).json({ message: "Name not found" });
    }
    if (!file) {
      return res.status(400).json({ message: "Icon not found" });
    }

        const fileName = `key-features-icon-${Date.now()}.svg`;
        const folderName = `key-features-icon`;

    const key_features_icon = await uploadImage(
      file.buffer,
      fileName,
      folderName
    );

    const newKeyFeaturesAdmin = new KeyFeaturesAdmin({
      name,
      key_features_icon,
    });

    await newKeyFeaturesAdmin.save();

    res.status(201).json({
      message: "Key feature added successfully",
      keyFeature: newKeyFeaturesAdmin,
    });
  } catch (error) {
    console.error("Error adding key feature: ", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.editKeyFeaturesAdmin = async (req, res) => {
    try {
        const { key_feature_id } = req.params;
        const { name } = req.body;
        const { file } = req;

        console.log(key_feature_id)

        if (!key_feature_id) {
            return res.status(400).json({ message: "Key feature ID is required" });
        }

    let keyFeaturesAdmin = await KeyFeaturesAdmin.findById(key_feature_id);

    if (!keyFeaturesAdmin) {
      return res.status(404).json({ message: "Key feature not found" });
    }

        if (name) {
            keyFeaturesAdmin.name = name;
        }

        if (file) {
            const fileName = `key-features-icon-${Date.now()}.svg`;
            const folderName = `key-features-icon`;
            const key_features_icon = await uploadImage(file.buffer, fileName, folderName);
            
            // Delete the previous image from Cloudinary
            if (keyFeaturesAdmin.key_features_icon) {
                await deleteImage(keyFeaturesAdmin.key_features_icon);
            }

            keyFeaturesAdmin.key_features_icon = key_features_icon;
        }


    keyFeaturesAdmin = await keyFeaturesAdmin.save();

    res
      .status(200)
      .json({ message: "Key feature updated successfully", keyFeaturesAdmin });
  } catch (error) {
    console.error("Key feature editing failed: ", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.deleteKeyFeatureAdmin = async (req, res) => {
  try {
    const { key_feature_id } = req.params;

    if (!key_feature_id) {
      return res.status(404).send({
        error: "Webinar not found!!",
      });
    }

    const deletedKeyFeatureAdmin = await KeyFeaturesAdmin.findByIdAndDelete({
      _id: key_feature_id,
    });

    if (!deletedKeyFeatureAdmin) {
      return res.status(404).json({ message: "Key Feature not found" });
    }
    const deletedImage = await deleteImage(
      deletedKeyFeatureAdmin?.key_features_icon
    );

    if (!deletedImage)
      return res.status(500).send({
        error: "Error deleting image",
      });

    res.status(200).json({ message: deletedImage.message });
  } catch (error) {
    console.error("Error deleting Key Feature: ", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.findOneKeyFeatureAdmin = async (req, res) => {
  try {
    const { key_feature_id } = req.params;
    
    const keyFeatureAdmin = await keyFeaturesAdmin.findOne({ _id: key_feature_id});

    if (!keyFeatureAdmin) {
      return res.status(404).send({
        error: "Key feature not found"
      });
    }

    // If key feature is found, send it in the response
    res.status(200).send(keyFeatureAdmin);
  } catch (error) {
    console.log(error)
    res.status(500).send({
      error: "Internal server error"
    })
  }
}

exports.getKeyFeaturesByIds = async (req, res) => {
  try {
    let { key_feature_ids } = req.query;
    key_feature_ids = JSON.parse(key_feature_ids);
    console.log(key_feature_ids)

    const all_ids = await KeyFeaturesAdmin.find({}, '_id');
    const all_ids_strings = all_ids.map(item => item._id.toString());
    const ids_in_key_features = all_ids_strings.filter(id => key_feature_ids.includes(id));

    const keyFeatures = await KeyFeaturesAdmin.find({ _id: { $in: ids_in_key_features } });
    

    if (keyFeatures.length === 0) {
      return res.status(200).send([]);
    }


    res.status(200).send(keyFeatures);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      error: "Internal server error"
    });
  }
};
