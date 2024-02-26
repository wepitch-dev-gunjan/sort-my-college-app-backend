const express = require("express");
const { createDocumentType, getDocumentTypes, getDocumentType, editDocumentType, deleteDocumentType } = require("../controllers/documentTypeController");
const router = express.Router();

//post
router.post("/documentType/create-document", createDocumentType);

//get
router.get("/documentType/documentTypes", getDocumentTypes);
router.get("/documentType/:documentType_id/documentType", getDocumentType);

// PUT
router.put("/documentType/:documentType_id", editDocumentType);

router.delete("/documentType/:documentType_id", deleteDocumentType);
module.exports = router;
