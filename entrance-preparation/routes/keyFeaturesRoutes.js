const express = require("express");
const {
    epAuth,
    adminAuth,
    userAuth,
} = require("../middlewares/authMiddleware");
const {
    getKeyFeatures,
    addKeyFeatureForAdmin,
} = require("../controllers/keyFeaturesControllers");
const router = express.Router();


// EP Panel Routes 
router.get("/key-features/:institute_id", epAuth, getKeyFeatures);
// router.post("/:institute_id/key-features", epAUth, addKeyFeature);
// router.put("/key-feature/:key_feature_id", epAUth, editKeyFeature);
// router.delete("/key-feature/:key_feature_id", epAuth, deleteKeyFeature);


// ADMIN Panel Routes 
// router.get("/key-features/admin", adminAuth, getKeyFeaturesForAdmin);
router.post("/key-features/admin", adminAuth, addKeyFeatureForAdmin);
// router.put("/key-feature/admin/:key_feature_id", adminAUth, editKeyFeatureForAdmin);
// router.delete("/key-feature/admin/:key_feature_id", adminAuth, deleteKeyFeatureForAdmin);

// Router for USER 
// router.get("/key-features/user", userAuth, getKeyFeaturesForUser);


module.exports = router;