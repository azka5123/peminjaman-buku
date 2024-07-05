const { Member, Book, BorrowedBooks } = require('../../models');
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
     res.status(200).json(members);
  })
  .catch((error) => {
    res.status(500).json(error);
  });
}

async function pinjamBuku(req, res) {
  const memberCode = req.params.memberCode;
  try {
    const checkMember = await Member.findOne({ where: { code: memberCode, status:'penalized' } });
    if(checkMember){
      const penaltyTimeFormatted = moment(checkMember.penaltyTime).format('YYYY-MM-DD HH:mm');
      return res.status(400).json('Member sedang dalam masa penalized hingga ' + penaltyTimeFormatted);
    }
    const books = await Book.findAll();
    const availableBooks = books.filter(book => book.stock > 0);
    res.status(200).json(availableBooks);
  } catch (error) {
    res.status(500).json(error);
  }
}

async function postPinjamBuku(req, res) {
  const memberCode = req.params.memberCode;
  const { bookCode } = req.body;
  const borrowedAt = new Date(); 
  if(bookCode.length > 2){
    return res.status(400).json('Hanya boleh meminjam maksimal 2 buku');
  }
  try {
    const checkBookCode = await BorrowedBooks.findAll({
        where: {
          memberCode: memberCode,
          bookCode: {
            [Sequelize.Op.in]: bookCode
          }
        }
      });
  
      if (checkBookCode.length > 0) {
        return res.status(300).json('Sudah meminjam buku ini');
      }
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
    res.status(200).json('Berhasil Meminjam Buku');
  } catch (error) {
    res.status(500).json(error);
  }

}

async function pengembalianBuku(req,res){
  const memberCode = req.params.memberCode;
  try {
    const checkBooks = await BorrowedBooks.findAll({where:{memberCode:memberCode, status:'borrowed'}});
    const bookCodes = checkBooks.map(book => book.bookCode);

    const books = await Book.findAll({
        where: { code: bookCodes }
    });

    res.status(200).json(books);
  } catch (error) {
    res.status(500).json(error);
  }
}

async function postPengembalianBuku(req, res) {
  const memberCode = req.params.memberCode;
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
    res.status(200).json('Berhasil Mengembalikan Buku');

  } catch (error) {
    res.status(500).json(error);
  }
}

module.exports = {
  index,
  pinjamBuku,
  postPinjamBuku,
  pengembalianBuku,
  postPengembalianBuku
};
