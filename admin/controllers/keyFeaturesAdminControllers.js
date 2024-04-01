const KeyFeaturesAdmin = require("../models/keyFeaturesAdmin");
const { uploadImage, deleteImage } = require("../services/cloudinary");

exports.getKeyFeaturesForAdmin = async (req, res) => {
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

exports.addKeyFeatureForAdmin = async (req, res) => {
    try {
        const { name } = req.body;
        const { file } = req;

        if ( !name) {
            return res.status(400).json({message: "Name not found"})
        }
        if ( !file) {
            return res.status(400).json({message: "Icon not found"})
        }


        const fileName = `key-features-icon-${Date.now()}.png`;
        const folderName = `key-features-icon`;

        const key_features_icon = await uploadImage(file.buffer, fileName, folderName)

        const newKeyFeaturesAdmin = new KeyFeaturesAdmin({
            name,
            key_features_icon
        });
        
        await newKeyFeaturesAdmin.save();
        
        res.status(201).json({ message: "Key feature added successfully", keyFeature: newKeyFeaturesAdmin});

    } catch (error) {
        console.error("Error adding key feature: ", error)
        res.status(500).json({message: "Internal Server Error"})
    }
};

exports.editKeyFeaturesForAdmin = async (req, res) => {
    try {
        const { key_feature_id } = req.params;
        const { name, icon } = req.body;
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
        if (icon) {
            keyFeaturesAdmin.icon = icon;
        }

        keyFeaturesAdmin = await keyFeaturesAdmin.save();

        res.status(200).json({ message: "Key feature updated successfully", keyFeaturesAdmin });
    } catch (error) {
        console.error("Key feature editing failed: ", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

exports.deleteKeyFeatureForAdmin = async (req, res) => {
    try {
        const { key_feature_id } = req.params;

        if (!key_feature_id) {
        return res.status(404).send({
            error: "Webinar not found!!"
        });
        }

        const deletedKeyFeatureAdmin = await KeyFeaturesAdmin.findByIdAndDelete({_id : key_feature_id});
        
        if(!deletedKeyFeatureAdmin) {
            return res.status(404).json({ message: "Key Feature not found" });
        }
        const deletedImage = await deleteImage(deletedKeyFeatureAdmin?.key_features_icon);

        if(!deletedImage) return res.status(500).send({
            error: "Error deleting image"
        })

        res.status(200).json({ message: deletedImage.message });
    } catch (error) {
        console.error("Error deleting Key Feature: ", error)
        res.status(500).json({ message: "Internal Server Error" });
    }
}