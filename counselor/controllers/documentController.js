const Document = require("../models/Document");
const DocumentType = require("../models/DocumentType");
const {
  uploadImage,
  cloudinary,
  deleteImage,
} = require("../services/cloudinary");

exports.getDocuments = async (req, res) => {
  try {
    console.log("try");
    const { counsellor_id } = req;
    console.log(counsellor_id);

    const documents = await Document.find({
      user: JSON.stringify(counsellor_id),
    });
    if (!documents)
      return res.status(404).send({
        error: "Documents not found",
      });
    res.status(200).send(documents);
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

exports.getDocumentsForAdmin = async (req, res) => {
  try {
    const { counsellor_id } = req.params;
    const documents = await Document.find({
      user: JSON.stringify(counsellor_id),
    });
    if (!documents)
      return res.status(404).send({
        error: "Documents not found",
      });
    res.status(200).send(documents);
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

exports.getDocument = async (req, res) => {
  try {
    const { document_id } = req;
    const document = await Document.findOne({ _id: document_id });
    if (!document) return res.status(404).send({ error: "Document not found" });
    res.status(200).send(document);
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

exports.editDocument = async (req, res) => {
  try {
    const { document_id } = req.params;
    const { document_type, file } = req.body;

    const document = await Document.findOne({ _id: document_id });
    if (!document) return res.status(404).send({ error: "Document not found" });

    if (document_type) doc.document_type = document_type;
    if (file) doc.file = file;

    await document.save();
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

exports.postDocument = async (req, res) => {
  try {
    const { file, id } = req;
    const formattedId = JSON.stringify(id);
    const { document_type } = req.query;
    if (!document_type)
      return res.status(404).send({
        error: "DocumentType is required",
      });

    if (!file) {
      return res.status(400).json({ error: "No files uploaded" });
    }

    const documentType = await DocumentType.findOne({ _id: document_type });
    if (!documentType)
      return res.status(400).send({ error: "Document type does not exist" });

    const existingDocument = await Document.findOne({
      document_type: documentType._id,
      user: formattedId,
    });
    if (existingDocument) {
      return res.status(400).send({ error: "Document already exists" });
    }

    let newDocument = await Document.findOne({
      document_type: documentType,
      user: id,
    });
    if (newDocument)
      return res.status(400).send({
        error: "Document already exists, Can't re-upload same document",
      });

    const fileName = `document-image-${Date.now()}.jpeg`;
    const folderName = "document-images";

    const result = await uploadImage(file.buffer, fileName, folderName);
    newDocument = new Document({
      user: formattedId,
      document_type: documentType._id,
      file: result,
    });

    await newDocument.save();

    res.status(200).send(newDocument);
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

exports.deleteDocument = async (req, res) => {
  try {
    const { document_id } = req.params;
    const document = await Document.findOneAndDelete({ _id: document_id });
    if (!document) return res.status(404).send({ error: "Document not found" });

    const imageDeleted = await deleteImage(document.file);
    if (!imageDeleted) {
      res.status(500).send({ error: "Image not deleted" });
    }
    res.status(200).send({
      message: "document successfully deleted",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};
