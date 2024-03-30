const KeyFeatures = require("../models/KeyFeatures");

// EP Panel Controllers 
exports.getKeyFeatures = async (req, res) => {
    try {
        const instituteId = req.params.institute_id;

        // Find key features associated with the institute
        const keyFeatures = await KeyFeatures.find({ institute: instituteId });

        if (!keyFeatures) {
            return res.status(404).json({ message: "Key features not found for the specified institute" });
        }

        // If key features are found, return them
        res.status(200).json(keyFeatures );
    } catch (error) {
        console.error("Error fetching Key Features: ", error);
        res.status(500).json({ message: "Internal Server Error!!" });
    }
};

// ADMIN Panel Routes 
exports.addKeyFeatureForAdmin = async (req, res) => {
    try {
        const { name, icon } = req.body;
        if ( !name || !icon ) {
            return res.status(400).json({message: "Name or icon not found"})
        }

        const newKeyFeature = new KeyFeatures({
            name,
            icon
        });

        await newKeyFeature.save();
        res.status(201).json({ message: "Key feature added successfully", keyFeature: newKeyFeature});

    } catch (error) {
        console.error("Error adding key feature: ", error)
        res.status(500).json({message: "Internal Server Error"})
    }
};




// ██╗░░██╗███████╗██╗░░░██╗  ███████╗███████╗░█████╗░████████╗██╗░░░██╗██████╗░███████╗░██████╗
// ██║░██╔╝██╔════╝╚██╗░██╔╝  ██╔════╝██╔════╝██╔══██╗╚══██╔══╝██║░░░██║██╔══██╗██╔════╝██╔════╝
// █████═╝░█████╗░░░╚████╔╝░  █████╗░░█████╗░░███████║░░░██║░░░██║░░░██║██████╔╝█████╗░░╚█████╗░
// ██╔═██╗░██╔══╝░░░░╚██╔╝░░  ██╔══╝░░██╔══╝░░██╔══██║░░░██║░░░██║░░░██║██╔══██╗██╔══╝░░░╚═══██╗
// ██║░╚██╗███████╗░░░██║░░░  ██║░░░░░███████╗██║░░██║░░░██║░░░╚██████╔╝██║░░██║███████╗██████╔╝
// ╚═╝░░╚═╝╚══════╝░░░╚═╝░░░  ╚═╝░░░░░╚══════╝╚═╝░░╚═╝░░░╚═╝░░░░╚═════╝░╚═╝░░╚═╝╚══════╝╚═════╝░