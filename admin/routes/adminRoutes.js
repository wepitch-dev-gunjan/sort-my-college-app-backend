const express = require("express");
const {
  createAdmin,
  deleteAdmin,
  getAdmin,
} = require("../controllers/adminController");
const router = express.Router();

router.post("/", createAdmin);
router.get("/:admin_id", getAdmin);
router.delete("/:admin_id", deleteAdmin);

module.exports = router;
