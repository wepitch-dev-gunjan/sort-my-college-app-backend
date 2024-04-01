const express = require("express");
const { adminAuth } = require("../middlewares/authMiddleware");
const {
    getKeyFeaturesForAdmin,
    addKeyFeatureForAdmin,
    editKeyFeaturesForAdmin,
    deleteKeyFeatureForAdmin
} = require("../controllers/keyFeaturesAdminControllers");
const upload = require("../middlewares/uploadBanner");
const router = express.Router();

router.get("/key-features-admin", adminAuth, getKeyFeaturesForAdmin);
router.post("/key-features-admin", adminAuth, upload.single("key_features_icon"), addKeyFeatureForAdmin);
router.put("/key-features-admin/:key_feature_id", adminAuth, editKeyFeaturesForAdmin);
router.delete("/key-features-admin/:key_feature_id", adminAuth, deleteKeyFeatureForAdmin);

module.exports = router;