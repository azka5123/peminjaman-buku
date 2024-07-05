const { Member, Book, BorrowedBooks } = require('../models');
const Sequelize = require('sequelize');
const moment = require('moment');

async function index(req, res) {
  Member.findAll({
    attributes: {
      include: [
        [Sequelize.literal(`(
          SELECT COUNT(*)
          FROM "BorrowedBooks" AS bb
          WHERE
            bb."memberCode" = "Member"."code" AND
            bb."status" = 'borrowed'
        )`), 'booksCount']
      ]
    }
  })
  .then((members) => {
     res.json(members);
    // res.render('pages/member/index', { title: 'Member', members });
  })
  .catch((err) => {
    res.send(err);
  });
}

async function pinjamBuku(req, res) {
  const memberCode = req.params.code;
  try {
    const checkMember = await Member.findOne({ where: { code: memberCode, status:'penalized' } });
    if(checkMember){
      const penaltyTimeFormatted = moment(checkMember.penaltyTime).format('YYYY-MM-DD HH:mm');
      req.flash('error', 'Member sedang dalam masa penalized hingga ' + penaltyTimeFormatted);
      return res.redirect('/member/index');
    }
    const books = await Book.findAll();
    const borrowedBooksCount = await BorrowedBooks.count({ where: { memberCode: memberCode, status: 'borrowed' } });

    const maxBooks = borrowedBooksCount === 0 ? 2 : borrowedBooksCount === 1 ? 1 : borrowedBooksCount === 2 ? 0 : 0;
    const availableBooks = books.filter(book => book.stock > 0);
    res.render('pages/member/pinjamBuku', { title: 'Peminjaman Buku', books: availableBooks, maxBooks, memberCode });
  } catch (error) {
    res.send(error);
  }
}

function postPinjamBuku(req, res) {
  const memberCode = req.params.code;
  const { bookCode } = req.body;
  const borrowedAt = new Date(); 
  try {
    bookCode.forEach(code => {
      BorrowedBooks.create({
        memberCode: memberCode, 
        bookCode: code, 
        borrowedAt: borrowedAt,
        maxReturnAt: new Date(borrowedAt.getTime() + 7 * 24 * 60 * 60 * 1000), 
        status: 'borrowed'
      }).then(() => {
        return Book.update({ stock: Sequelize.literal('stock - 1') }, { where: { code: code } });
      });
    });
    req.flash('success', 'Berhasil Meminjam Buku');
    res.redirect('/member/index');
  } catch (error) {
    res.status(500).send('Error borrowing books: ' + error.message);
  }

}

async function pengembalianBuku(req,res){
  const memberCode = req.params.code;
  try {
    const checkBooks = await BorrowedBooks.findAll({where:{memberCode:memberCode, status:'borrowed'}});
    const bookCodes = checkBooks.map(book => book.bookCode);

    const books = await Book.findAll({
        where: { code: bookCodes }
    });

    res.render('pages/member/pengembalianBuku', { title: 'Pengembalian Buku', books, memberCode });
  } catch (error) {
    res.send(error);
  }
}

async function postPengembalianBuku(req, res) {
  const memberCode = req.params.code;
  const { bookCode } = req.body;
  const returnAt = new Date();

  try {
    for (const code of bookCode) {
      const borrowedBook = await BorrowedBooks.findOne({
        where: { memberCode: memberCode, bookCode: code }
      });

      if (borrowedBook.maxReturnAt < returnAt) {
        await Member.update({
          status: 'penalized',
          penaltyTime: new Date(returnAt.getTime() + 3 * 24 * 60 * 60 * 1000) 
        }, {
          where: { code: memberCode }
        });
      }
     
      await BorrowedBooks.update({
        returnedAt: returnAt,
        status: 'returned'
      }, {
        where: { memberCode: memberCode, bookCode: code }
      });

      await Book.update({
        stock: Sequelize.literal('stock + 1')
      }, {
        where: { code: code }
      });
    }
    req.flash('success', 'Berhasil Mengembalikan Buku');
    res.redirect('/member/index');

  } catch (error) {
    console.error('Error returning books:', error);
    res.status(500).send('Error returning books: ' + error.message);
  }
}

module.exports = {
  index,
  pinjamBuku,
  postPinjamBuku,
  pengembalianBuku,
  postPengembalianBuku
};
