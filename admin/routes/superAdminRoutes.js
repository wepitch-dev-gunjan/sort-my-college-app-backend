const express = require("express");
const { createSuperAdmin } = require("../controllers/superAdminController");

const router = express.Router();

router.post("/super_admin", createSuperAdmin);

module.exports = router;
