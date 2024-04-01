const express = require("express");
const {
    epAuth,
    adminAuth,
    userAuth,
} = require("../middlewares/authMiddleware");
const {
    addKeyFeature,
    getKeyFeatures
} = require("../controllers/keyFeaturesControllers");
const router = express.Router();


// EP Panel Routes 

router.get("/key-features", epAuth, getKeyFeatures);
router.post("/key-features", epAuth, addKeyFeature);
// router.put("/key-feature/:key_feature_id", epAUth, editKeyFeature);
// router.delete("/key-feature/:key_feature_id", epAuth, deleteKeyFeature);


// ADMIN Panel Routes 
// router.get("/key-features/admin", adminAuth, getKeyFeaturesForAdmin);
// router.post("/key-features/admin", adminAuth, addKeyFeatureForAdmin);
// router.put("/key-feature/admin/:key_feature_id", adminAuth, editKeyFeaturesForAdmin);
// router.delete("/key-feature/admin/:key_feature_id", adminAuth, deleteKeyFeatureForAdmin);

// Router for USER 
// router.get("/key-features/user", userAuth, getKeyFeaturesForUser);


module.exports = router;