const express = require('express');
const { counsellorOrUserAuth } = require('../middlewares/authMiddleware');
const { getIssues, getIssue, postIssue, updateIssue, deleteIssue } = require('../controllers/issueController');
const router = express.Router();

router.get('/help/issue', getIssues);
router.get('/help/issue/:issue_id', getIssue);
router.post('/help/issue', counsellorOrUserAuth, postIssue);
router.put('/help/issue/:issue_id', updateIssue);
router.delete('/help/issue/:issue_id', deleteIssue);

module.exports = router;