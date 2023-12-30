const express = require("express");
const {
  createAdmin,
  deleteAdmin,
  getAdmin,
} = require("../controllers/adminController");
const { adminAuth } = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/", adminAuth, createAdmin);
router.get("/:admin_id", getAdmin);
router.delete("/:admin_id", deleteAdmin);

module.exports = router;
