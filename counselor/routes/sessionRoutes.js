const express = require("express");
const {
  updateSession,
  bookSession,
  getSessions,
  addSession,
  getSession,
  deleteSession,
  rescheduleSession,
  cancelSession,
  getSessionsForCounsellor,
  getTotalSessionsCount,
  getCheckoutDetails,
  bookSessionValidation,
  getLatestSessions
} = require("../controllers/sessionController");
const { counsellorAuth, userAuth } = require("../middlewares/authMiddleware");
const router = express.Router();

// GET
router.get("/:counsellor_id/sessions", getSessions);
router.get("/:counsellor_id/sessionsforcounsellor", getSessionsForCounsellor);
router.get("/sessions/:session_id", getSession);
router.get("/session/sessions/count", counsellorAuth, getTotalSessionsCount);
router.get(
  "/session/sessions/latest-sessions",
  userAuth,
  getLatestSessions
);

// POST
router.post("/sessions", counsellorAuth, addSession);

// PUT
router.put("/sessions/:session_id", updateSession);
router.put(
  "/sessions/:session_id/book-validation",
  userAuth,
  bookSessionValidation
);
router.put("/sessions/:session_id/book", userAuth, bookSession);
router.put("/sessions/:session_id/reschedule", rescheduleSession);
router.put("/counsellor/sessions/:session_id/cancel", cancelSession);
// router.put('/session/:counseling_id/reschedule', rescheduleSession);
// router.put('/session/:counseling_id/cancel', cancelSession);

// DELETE
router.delete("/sessions/:session_id", counsellorAuth, deleteSession);

// user routes
router.get(
  `/sessions/:session_id/payment/user/checkout`,
  userAuth,
  getCheckoutDetails
);

module.exports = router;
