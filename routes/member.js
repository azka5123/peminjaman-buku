const express = require('express');
const router = express.Router();
const { index, pinjamBuku, postPinjamBuku, pengembalianBuku, postPengembalianBuku } = require('../controllers/memberController');

router.get('/index', index);
router.get('/pinjam-buku/:code', pinjamBuku);
router.post('/pinjam-buku/:code', postPinjamBuku);
router.get('/pengembalian-buku/:code', pengembalianBuku);
router.post('/pengembalian-buku/:code', postPengembalianBuku);

module.exports = router;
