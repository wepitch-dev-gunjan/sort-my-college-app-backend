const express = require("express");
const {
  editdocumentType,
  deletedocumentType,
  postdocumentType,
  getdocumentTypes,
  getdocumentType,
} = require("../controllers/documentTypeController");
const router = express.Router();

//post
router.post("/documentType", postdocumentType);

//get
router.get("/documentType/:documentType_id/documentTypes", getdocumentTypes);
router.get("/documentType/:documentType_id/documentType", getdocumentType);

// PUT
router.put("/documentType/:documentType_id", editdocumentType);

router.delete("/documentType/:documentType_id", deletedocumentType);
module.exports = router;
