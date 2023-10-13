const express = require('express');
const router = express.Router();

router.get('/:counsellor_id/courses', getCourses)

module.exports = router;