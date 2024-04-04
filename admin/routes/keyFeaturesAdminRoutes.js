const express = require("express");
const { epAuth, adminAuth } = require("../middlewares/authMiddleware");
const {
    getKeyFeaturesAdmin,
    addKeyFeatureAdmin,
    editKeyFeaturesAdmin,
    deleteKeyFeatureAdmin,
    getRemainingKeyFeaturesForInstitute,
    findOneKeyFeatureAdmin
} = require("../controllers/keyFeaturesAdminControllers");
const upload = require("../middlewares/uploadBanner");
const router = express.Router();

// Routes for Admin
router.get("/key-features-admin", adminAuth, getKeyFeaturesAdmin);
router.post("/key-features-admin", adminAuth, upload.single("key_features_icon"), addKeyFeatureAdmin);
router.put("/key-features-admin/:key_feature_id", upload.single("key_features_icon"),adminAuth, editKeyFeaturesAdmin);
router.delete("/key-features-admin/:key_feature_id", adminAuth, deleteKeyFeatureAdmin);

// Routes for Institute 
router.get("/key-features-institute/remaining-key-features-for-institute", epAuth, getRemainingKeyFeaturesForInstitute)
router.get("/key-features-institute/find-one-key-feature", findOneKeyFeatureAdmin)


module.exports = router;