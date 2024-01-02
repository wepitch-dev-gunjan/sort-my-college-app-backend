const express = require("express");
const {
  createAdmin,
  deleteAdmin,
  getAdmin,
  findOneAdmin,
} = require("../controllers/adminController");
const { adminAuth } = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/", adminAuth, createAdmin);
router.get("/", adminAuth, getAdmin);
router.get('/admins', findOneAdmin);
router.delete("/:admin_id", deleteAdmin);

module.exports = router;
