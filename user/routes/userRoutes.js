const express = require("express");
const {
  rescheduleRequest,
  cancelRequest,
  saveCounsellor,
  unsaveCounsellor,
  editUser,
  getUser,
  findOneUser,
  getUsersForAdmin,
} = require("../controllers/userController");
const { userAuth } = require("../middlewares/authMiddleware");
const { adminAuth } = require("../../admin/middlewares/authMiddleware");
// const { userAuth } = require('../middlewares/authMiddleware');
const router = express.Router();

// user profile
router.get("/", userAuth, getUser);
router.get("/users", findOneUser);
router.get("/users-for-admin", getUsersForAdmin);

// save counsellors
router.put("/:user_id", userAuth, editUser);
router.put("/:user_id/counsellor/save", saveCounsellor);
router.put("/:user_id/counsellor/unsave", unsaveCounsellor);

// counselling sessions
router.post("/seesion/reschedule-request", rescheduleRequest);
router.post("/session/cancel-request", cancelRequest);

module.exports = router;
