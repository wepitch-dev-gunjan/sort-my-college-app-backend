const Document = require("../models/Document");

exports.getDocuments = async (req, res) => {
  try {
    const documents = await Document.find({});
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
    res.status(200).send(documents);
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
    const { document_type, file } = req.body;
    const existingDocument = await Document.findOne({ document_type });

    if (existingDocument) {
      return res.status(400).send({ error: "Document already exists" });
    }

    const doc = {};
    if (document_type) doc.document_type = document_type;
    if (file) doc.file = file;

    const newDocument = new Document({
      document_type,
      file,
    });

    await newDocument.save();

    res.status(200).send({ message: "Feed created successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

exports.deleteDocument = async (req, res) => {
  const { document_id } = req.params;
  const document = await Document.findOneAndDelete({ _id: document_id });
  if (!document) return res.status(404).send({ error: "Document not found" });
  res.status(200).send({ message: "Deleted " });

  try {
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};
