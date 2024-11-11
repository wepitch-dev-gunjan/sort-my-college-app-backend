const express = require("express");
const {
  rescheduleRequest,
  cancelRequest,
  saveCounsellor,
  unsaveCounsellor,
  editUser,
  getProfile,
  findOneUser,
  getUsersForAdmin,
  getSingleUser,
  getUserForEp,
  getUserForAdmin,
} = require("../controllers/userController");
const { userAuth } = require("../middlewares/authMiddleware");
const { adminAuth } = require("../../admin/middlewares/authMiddleware");
const { register } = require("../controllers/userController");
const { upload } = require("../middlewares/uploadImage");
// const { userAuth } = require('../middlewares/authMiddleware');
const router = express.Router();

// user routes
router.get("/", userAuth, getProfile);
router.put("/", userAuth, upload.single("profile_pic"), editUser);

router.put("/register", userAuth, register);
//user for ep
router.get("/ep/:user_id", getUserForEp);
router.get("/admin/:user_id", getUserForAdmin);

// admin routes
router.get("/users", findOneUser);
router.get("/users-for-admin", getUsersForAdmin);
router.get("/users-for-admin/:user_id", getSingleUser);

// counsellor routes
router.put("/counsellor/save", userAuth, saveCounsellor);
router.put("/counsellor/unsave", userAuth, unsaveCounsellor);

// counselling sessions
router.post("/seesion/reschedule-request", userAuth, rescheduleRequest);
router.post("/session/cancel-request", userAuth, cancelRequest);

module.exports = router;
