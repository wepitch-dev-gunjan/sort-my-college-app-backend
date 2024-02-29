const Document = require("../models/Document");
const DocumentType = require("../models/DocumentType");
const { uploadImage, cloudinary } = require("../services/cloudinary");

exports.getDocuments = async (req, res) => {
  try {
    const { counsellor_id } = req;
    const documents = await Document.find({ user: JSON.stringify(counsellor_id) });
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
    const { document_id } = req.params;
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
    const formattedId = JSON.stringify(id)
    const { document_type } = req.query;
    if (!document_type) return res.status(404).send({
      error: "DocumentType is required"
    })

    if (!file) {
      return res.status(400).json({ error: "No files uploaded" });
    }

    const documentType = await DocumentType.findOne({ _id: document_type })
    if (!documentType) return res.status(400).send({ error: "Document type does not exist" });

    const existingDocument = await Document.findOne({ document_type: documentType._id, user: formattedId });
    if (existingDocument) {
      return res.status(400).send({ error: "Document already exists" });
    }

    const result = await uploadImage(file.buffer);

    let newDocument = await Document.findOne({ document_type: documentType, user: id });
    if (newDocument) return res.status(400).send({
      error: "Document already exists, Can't re-upload same document"
    })

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

    cloudinary.uploader.destroy(document.file, (err, result) => {
      if (err) return res.status(501).send({ error: err.message });
      if (result) res.status(200).send({
        message: "Document deleted successfully"
      })
    })
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};
