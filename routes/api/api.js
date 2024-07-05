const express = require('express');
const checkPenalized = require('../../middleware/checkPenalized');
const checkUrl = require('../../middleware/checkUrl');
const memberRoutes = require('./member');
const bookRoutes = require('./book');

const router = express.Router();

router.use(checkPenalized);
router.use(checkUrl);

router.use('/api/member', memberRoutes);
router.use('/api/book', bookRoutes);

module.exports = router;