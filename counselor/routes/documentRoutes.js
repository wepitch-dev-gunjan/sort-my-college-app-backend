const express = require("express");
const {
  editDocument,
  deleteDocument,
  postDocument,
  getDocuments,
  getDocument,
} = require("../controllers/documentController");
const { upload } = require("../middlewares/uploadImage");
const { adminOrCounsellorAuth, counsellorAuth } = require("../middlewares/authMiddleware");
const router = express.Router();

//post
router.post("/document/upload-document", adminOrCounsellorAuth, upload.single('file'), postDocument);

//get
router.get("/document/get-documents", counsellorAuth, getDocuments);
router.get("/document/:document_id", getDocument);

// PUT
router.put("/document/:document_id", editDocument);

router.delete("/document/:document_id", deleteDocument);
module.exports = router;
