const express = require("express");
const {
    epAuth,
    adminAuth,
    userAuth,
} = require("../middlewares/authMiddleware");
const {
    addKeyFeature,
    getKeyFeatures,
    deleteKeyFeatures,
    getKeyFeaturesForAdmin,
    editKeyFeatures
} = require("../controllers/keyFeaturesControllers");
const router = express.Router();


// EP Panel Routes 

router.get("/key-features", epAuth, getKeyFeatures);
router.post("/key-features", epAuth, addKeyFeature);
router.delete("/key-features/:key_feature_id", epAuth, deleteKeyFeatures);
router.put("/key-features/edit/", epAuth, editKeyFeatures );


// ADMIN Panel Routes 
// router.get("/key-features/admin", adminAuth, getKeyFeaturesForAdmin);
// router.post("/key-features/admin", adminAuth, addKeyFeatureForAdmin);
// router.put("/key-feature/admin/:key_feature_id", adminAuth, editKeyFeaturesForAdmin);
// router.delete("/key-feature/admin/:key_feature_id", adminAuth, deleteKeyFeatureForAdmin);

// Routes FOR ADMIN 
router.get("/admin/key-features/:institute_id", getKeyFeaturesForAdmin);


// Router for USER 
// router.get("/key-features/user", userAuth, getKeyFeaturesForUser);


module.exports = router;