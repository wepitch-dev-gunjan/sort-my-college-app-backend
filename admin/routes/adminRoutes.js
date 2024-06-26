const express = require("express");
const { upload } = require("../middlewares/uploadImage");
const {
  createAdmin,
  deleteAdmin,
  getAdmin,
  findOneAdmin,
  editProfile,
  getOneAdmin,
  uploadProfilePic,
  adminLogin,
  getDashboardData,
  changePassword,
} = require("../controllers/adminController");
const { adminAuth } = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/", createAdmin);
router.get("/", adminAuth, getAdmin);
router.get("/admins", findOneAdmin);
router.delete("/:admin_id", deleteAdmin);
router.put("/:admin_id", adminAuth, editProfile);
router.post("/login", adminLogin);
router.get("/dashboard/dashboard-data", adminAuth, getDashboardData);
router.put("/", changePassword);

router.post(
  "/profile-pic",
  adminAuth,
  upload.single("image"),
  uploadProfilePic
);

module.exports = router;
