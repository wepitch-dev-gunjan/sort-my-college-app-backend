const express = require('express');
const router = express.Router();
const { getUsers, getSingleUser, createUser } = require('../controllers/userController');

// GET
router.get('/', getUsers);
router.get('/:user_id', getSingleUser);

// POST
router.post('/', createUser);

module.exports = router;
