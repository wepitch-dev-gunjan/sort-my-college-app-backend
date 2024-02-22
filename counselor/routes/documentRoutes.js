const express = require("express");
const {
  editDocument,
  deleteDocument,
  postDocument,
  getDocuments,
  getDocument,
} = require("../controllers/documentController");
const router = express.Router();

//post
router.post("/document", postDocument);

//get
router.get("/document", getDocuments);
router.get("/document/:document_id", getDocument);

// PUT
router.put("/document/:document_id", editDocument);

router.delete("/document/:document_id", deleteDocument);
module.exports = router;
