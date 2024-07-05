const express = require('express');
const router = express.Router();
const { index, pinjamBuku, postPinjamBuku, pengembalianBuku, postPengembalianBuku } = require('../../controllers/api/apiMemberController');

router.get('/index', index);
router.get('/pinjam-buku/:memberCode', pinjamBuku);
router.post('/pinjam-buku/:memberCode', postPinjamBuku);
router.get('/pengembalian-buku/:memberCode', pengembalianBuku);
router.post('/pengembalian-buku/:memberCode', postPengembalianBuku);

module.exports = router;
