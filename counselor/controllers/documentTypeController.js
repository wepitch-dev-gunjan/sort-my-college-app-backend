const DocumentType = require("../models/DocumentType");

exports.getDocumentTypes = async (req, res) => {
  try {
    const DocumentTypes = await DocumentType.find({});
    if (!DocumentTypes)
      return res.status(404).send({
        error: "Document Types not found",
      });
    res.status(200).send(DocumentTypes);
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

exports.getDocumentType = async (req, res) => {
  try {
    const { DocumentType_id } = req.params;
    const DocumentType = await DocumentType.findOne({ _id: DocumentType_id });
    if (!DocumentType)
      return res.status(404).send({ error: "DocumentType not found" });
    res.status(200).send(DocumentType);
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

exports.editDocumentType = async (req, res) => {
  try {
    const { DocumentType_id } = req.params;
    const { name } = req.body;

    const DocumentType = await DocumentType.findOne({ _id: DocumentType_id });
    if (!DocumentType)
      return res.status(404).send({ error: "Document Type not found" });

    if (name) doc.name = name;

    await DocumentType.save();
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

exports.createDocumentType = async (req, res) => {
  try {
    const { name } = req.body;
    const existingDocumentType = await DocumentType.findOne({ name });

    if (existingDocumentType) {
      return res.status(400).send({ error: "Document Type already exists" });
    }

    const newDocumentType = new DocumentType({
      name,
    });

    await newDocumentType.save();

    res.status(200).send({
      message: "document type created successfully",
      data: newDocumentType

    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

exports.deleteDocumentType = async (req, res) => {
  const { DocumentType_id } = req.params;
  const DocumentType = await DocumentType.findOneAndDelete({
    _id: DocumentType_id,
  });
  if (!DocumentType)
    return res.status(404).send({ error: "DocumentType not found" });
  res.status(200).send({ message: "Deleted " });

  try {
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};
