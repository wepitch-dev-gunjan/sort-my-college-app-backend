const express = require("express");
const {
  addBankDetails,
  getBankDetails,
  editBankDetails,
  deleteBankDetails,
} = require("../controllers/bankDetailsController");
const router = express.Router();

router.post("/:counsellor_id/bank", addBankDetails);
router.get("/:counsellor_id/bank/:details_id", getBankDetails);
router.put("/:counsellor_id/bank/:details_id", editBankDetails);
router.delete("/:counsellor_id/bank/:details_id", deleteBankDetails);

module.exports = router;
