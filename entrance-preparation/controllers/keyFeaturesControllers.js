const { findOneAndDelete } = require("../models/EntranceInstitute");
const KeyFeatures = require("../models/KeyFeatures");

// EP Panel Controllers 
exports.addKeyFeature = async (req, res) => {
    try{
        const { institute_id } = req;
        const { name, key_features_icon } = req.body;

        if (!institute_id) {
            return res.status(404).json({ message: "Specified institute not found" });
        }
        if (!name) {
            return res.status(404).json({ message: "Key Feature Name not found" });
        }
        if (!key_features_icon) {
            return res.status(404).json({ message: "Key Feature Icon not found" });
        }

        const newKeyFeature = new KeyFeatures({
            institute:institute_id,
            name,
            key_features_icon
        })

        await newKeyFeature.save();
        res.status(201).json({ message: "Key feature added successfully", keyFeature: newKeyFeature});


    } catch (error) {
        console.error("Error adding Key Features for Institutes")
        res.status(500).json({message: "Internal Server Error"})
    }
}

exports.getKeyFeatures = async (req, res) => {
    try {
        const { institute_id } = req;
        const allKeyFeatures = await KeyFeatures.find({institute : institute_id})

        if (!allKeyFeatures) {
            return res.status(404).json({ message: "Key features not found for the specified institute" });
        }

        res.status(200).json(allKeyFeatures);

    } catch (error) {
        console.error("Error getting Key Feature: ", error)
        res.status(500).json({ message: "Internal Server Error" });
    }
}

// ADMIN Panel Controllers 
// exports.getKeyFeaturesForAdmin = async (req, res) => {
//     try {

//         // Find key features associated with the institute
//         const keyFeatures = await KeyFeatures.find();

//         if (!keyFeatures) {
//             return res.status(404).json({ message: "Key features not found for the specified institute" });
//         }

//         // If key features are found, return them
//         res.status(200).json(keyFeatures);
//     } catch (error) {
//         console.error("Error fetching Key Features: ", error);
//         res.status(500).json({ message: "Internal Server Error!!" });
//     }
// };

// exports.addKeyFeatureForAdmin = async (req, res) => {
//     try {
//         const { name, icon } = req.body;
//         if ( !name || !icon ) {
//             return res.status(400).json({message: "Name or icon not found"})
//         }

//         const newKeyFeature = new KeyFeatures({
//             name,
//             icon
//         });

//         await newKeyFeature.save();
//         res.status(201).json({ message: "Key feature added successfully", keyFeature: newKeyFeature});

//     } catch (error) {
//         console.error("Error adding key feature: ", error)
//         res.status(500).json({message: "Internal Server Error"})
//     }
// };

// exports.editKeyFeaturesForAdmin = async (req, res) => {
//     try {
//         const { key_feature_id } = req.params;
//         const { name, icon } = req.body;
//         console.log(key_feature_id)
//         if (!key_feature_id) {
//             return res.status(400).json({ message: "Key feature ID is required" });
//         }

//         let keyFeature = await KeyFeatures.findById(key_feature_id);

//         if (!keyFeature) {
//             return res.status(404).json({ message: "Key feature not found" });
//         }

//         if (name) {
//             keyFeature.name = name;
//         }
//         if (icon) {
//             keyFeature.icon = icon;
//         }

//         keyFeature = await keyFeature.save();

//         res.status(200).json({ message: "Key feature updated successfully", keyFeature });
//     } catch (error) {
//         console.error("Key feature editing failed: ", error);
//         res.status(500).json({ message: "Internal Server Error" });
//     }
// };

// exports.deleteKeyFeatureForAdmin = async (req, res) => {
//     try {
//         const { key_feature_id } = req.params;

//         const deletedKeyFeature = await KeyFeatures.findByIdAndDelete({_id : key_feature_id});
//         console.log(key_feature_id)

//         if(!deletedKeyFeature) {
//             return res.status(404).json({ message: "Key Feature not found" });
//         }

//         res.status(200).json({ message: "Key Feature deleted Successfully" });

//     } catch (error) {
//         console.error("Error deleting Key Feature: ", error)
//         res.status(500).json({ message: "Internal Server Error" });
//     }
// }


// Controllers for USER 
// exports.getKeyFeaturesForUser = async (req, res) => {
//     try {
        
//     } catch (error) {
//         console.error("Error getting key features for User")
//         res.status(500).json({ message: "Internal Server Error" });
//     }
// }

// ██╗░░██╗███████╗██╗░░░██╗  ███████╗███████╗░█████╗░████████╗██╗░░░██╗██████╗░███████╗░██████╗
// ██║░██╔╝██╔════╝╚██╗░██╔╝  ██╔════╝██╔════╝██╔══██╗╚══██╔══╝██║░░░██║██╔══██╗██╔════╝██╔════╝
// █████═╝░█████╗░░░╚████╔╝░  █████╗░░█████╗░░███████║░░░██║░░░██║░░░██║██████╔╝█████╗░░╚█████╗░
// ██╔═██╗░██╔══╝░░░░╚██╔╝░░  ██╔══╝░░██╔══╝░░██╔══██║░░░██║░░░██║░░░██║██╔══██╗██╔══╝░░░╚═══██╗
// ██║░╚██╗███████╗░░░██║░░░  ██║░░░░░███████╗██║░░██║░░░██║░░░╚██████╔╝██║░░██║███████╗██████╔╝
// ╚═╝░░╚═╝╚══════╝░░░╚═╝░░░  ╚═╝░░░░░╚══════╝╚═╝░░╚═╝░░░╚═╝░░░░╚═════╝░╚═╝░░╚═╝╚══════╝╚═════╝░