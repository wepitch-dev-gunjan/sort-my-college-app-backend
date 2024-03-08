const BankDetails = require("../models/BankDetails");
const Counsellor = require("../models/Counsellor");

exports.addBankDetails = async (req, res) => {
  try {
    const { counsellor_id } = req.params;
    const {
      recepient_name,
      bank_name,
      branch,
      account_type,
      account_number,
      ifsc_code,
    } = req.body;

    const counsellor = await Counsellor.findById(counsellor_id);
    if (!counsellor)
      return res.status(404).send({ error: "Counsellor not found" });

    if (!recepient_name)
      return res.status(404).send({ error: "Recepient name is neccessary" });

    if (!bank_name)
      return res.status(404).send({ error: "Bank name is neccessary" });

    if (!branch)
      return res.status(404).send({ error: "Branch name is neccessary" });

    if (!account_type)
      return res.status(404).send({ error: "Account Type is neccessary" });

    if (!account_number)
      return res.status(404).send({ error: "Account Number is neccessary" });

    if (!ifsc_code)
      return res.status(404).send({ error: "IFSC Code is neccessary" });

    const bank_details = new BankDetails({
      recepient_name,
      bank_name,
      branch,
      account_type,
      account_number,
      ifsc_code,
    });

    await bank_details.save();
    res.status(200).send({ message: "Bank details added", bank_details });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

exports.getBankDetails = async (req, res) => {
  try {
    const { details_id, counsellor_id } = req.params;

    const counsellor = await Counsellor.findById(counsellor_id);
    if (!counsellor)
      return res.status(404).send({ error: "Counsellor not found" });

    const details = await BankDetails.findById(details_id);
    if (!details)
      return res.status(404).send({ error: "Bank details not found" });

    res.status(200).send(details);
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

exports.editBankDetails = async (req, res) => {
  try {
    const { details_id, counsellor_id } = req.params;
    const updateFields = {};

    if (req.body.recepient_name) {
      updateFields.recepient_name = req.body.recepient_name;
    }

    if (req.body.bank_name) {
      updateFields.bank_name = req.body.bank_name;
    }

    if (req.body.branch) {
      updateFields.branch = req.body.branch;
    }

    if (req.body.account_number) {
      updateFields.account_number = req.body.account_number;
    }

    if (req.body.account_type) {
      updateFields.account_type = req.body.account_type;
    }

    if (req.body.ifsc_code) {
      updateFields.ifsc_code = req.body.ifsc_code;
    }

    const updatedBankDetails = await BankDetails.findByIdAndUpdate(
      details_id,
      updateFields,
      { new: true }
    );

    if (!updatedBankDetails) {
      return res.status(404).send({ error: "Details not found" });
    }

    res.status(200).send({ message: "Updated successfully", updateFields });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

exports.deleteBankDetails = async (req, res) => {
  const { counsellor_id, details_id } = req.params;

  const counsellor = await Counsellor.findById(counsellor_id);
  if (!counsellor)
    return res.status(404).send({ error: "Counsellor not found" });

  const details = await BankDetails.findByIdAndDelete(details_id);
  if (!details)
    return res.status(404).send({ error: "Bank details not found" });

  res.status(200).send({ message: "Details deleted " });

  res.status(200).send(details);
  try {
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};
