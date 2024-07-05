const express = require('express');
const router = express.Router();
const { index } = require('../controllers/bookController');

router.get('/index', index);

module.exports = router;
