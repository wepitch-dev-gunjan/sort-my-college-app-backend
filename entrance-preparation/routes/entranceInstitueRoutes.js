const express = require('express');
const { createInstitute, getInstitutes } = require('../controllers/entranceInstituteControllers');
const router = express.Router();

router.post('/', createInstitute)
router.get('/institute', getInstitutes)

module.exports = router;