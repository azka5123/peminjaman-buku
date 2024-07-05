const express = require('express');
const router = express.Router();
const { index } = require('../../controllers/api/apiBookController');

router.get('/index', index);

module.exports = router;
