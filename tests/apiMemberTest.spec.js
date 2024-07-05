const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../index');
const expect = chai.expect;
const { Member, Book, BorrowedBooks } = require('../models');
const moment = require('moment');

chai.use(chaiHttp);

const mockMember = [
  {
    code: "M001",
    name: "Angga",
    status: "Active"
  },
  {
    code: "M002",
    name: "Ferry",
    status: "Active"
  },
  {
    code: "M003",
    name: "Putri",
    status: "Active"
  },
]
const mockBook = [
  {
    code: "JK-45",
    title: "Harry Potter",
    author: "J.K Rowling",
    stock: 1
  },
  {
    code: "SHR-1",
    title: "A Study in Scarlet",
    author: "Arthur Conan Doyle",
    stock: 1
  },
  {
    code: "TW-11",
    title: "Twilight",
    author: "Stephenie Meyer",
    stock: 1
  },
  {
    code: "HOB-83",
    title: "The Hobbit, or There and Back Again",
    author: "J.R.R. Tolkien",
    stock: 1
  },
  {
    code: "NRN-7",
    title: "The Lion, the Witch and the Wardrobe",
    author: "C.S. Lewis",
    stock: 1
  },
]

const mockBorrowedBooks = [
  { memberCode: 'M001', bookCode: 'JK-45', borrowedAt: new Date(), maxReturnAt: new Date(), status: 'borrowed' },
  { memberCode: 'M001', bookCode: 'TW-11', borrowedAt: new Date(), maxReturnAt: new Date(), status: 'borrowed' }
];

describe('API Member Controller', () => {
  before(async () => {
    await BorrowedBooks.destroy({ where: {} });
    await Member.destroy({ where: {} });
    await Book.destroy({ where: {} });
    await Book.bulkCreate(mockBook);
    await Member.bulkCreate(mockMember);
  });
  describe('GET /api/member/index', () => {
    it('should fetch all members with booksCount', (done) => {
      chai.request(app)
        .get('/api/member/index')
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('array');
          expect(res.body.every(member => member.booksCount !== undefined)).to.be.true;
          done();
        });
    });
  });
});

describe('API Member Controller', () => {
  before(async () => {
    await BorrowedBooks.destroy({ where: {} });
    await Member.destroy({ where: {} });
    await Book.destroy({ where: {} });
  });

  describe('GET /api/member/pinjam-buku/:memberCode', () => {
    it('should return available books for a member without penalty', async () => {
      const memberCode = mockMember[0].code;
      await Member.create({ ...mockMember[0] });
      await Book.bulkCreate(mockBook);

      const res = await chai.request(app).get(`/api/member/pinjam-buku/${memberCode}`);

      expect(res).to.have.status(200);
      expect(res.body).to.be.an('array');
    });

    it('should return penalized message for a member with penalty', async () => {
      const memberCode = mockMember[1].code;
      await Member.create({ ...mockMember[1], status: 'penalized', penaltyTime: moment().add(1, 'day') });

      const res = await chai.request(app).get(`/api/member/pinjam-buku/${memberCode}`);

      expect(res).to.have.status(400);
      expect(res.body).to.be.a('string').and.to.include('penalized');
    });
  });
});

describe('API Member Controller', () => {
  before(async () => {
    await BorrowedBooks.destroy({ where: {} });
    await Book.destroy({ where: {} });

    await Book.bulkCreate(mockBook);
    await BorrowedBooks.bulkCreate(mockBorrowedBooks);
  });

  describe('POST /api/member/pinjam-buku/:memberCode', () => {
    it('should borrow books successfully', async () => {
      const memberCode = mockMember[1].code;
      const requestBody = { bookCode: ['JK-45', 'TW-11'] };

      const res = await chai.request(app)
        .post(`/api/member/pinjam-buku/${memberCode}`)
        .send(requestBody);

      expect(res).to.have.status(200);
      expect(res.body).to.equal('Berhasil Meminjam Buku');

      const borrowedBooks = await BorrowedBooks.findAll({ where: { memberCode } });
      expect(borrowedBooks).to.have.lengthOf(2); // Meminjam 2 buku
    });

    it('should return error when borrowing more than 2 books', async () => {
      const memberCode = mockMember[2].code;
      const requestBody = { bookCode: ['JK-45', 'TW-11', 'SHR-1'] };

      const res = await chai.request(app)
        .post(`/api/member/pinjam-buku/${memberCode}`)
        .send(requestBody);

      expect(res).to.have.status(400);
      expect(res.body).to.equal('Hanya boleh meminjam maksimal 2 buku');
    });

    it('should return error when trying to borrow already borrowed book', async () => {
      const memberCode = mockMember[1].code;
      const requestBody = { bookCode: ['JK-45'] };

      const res = await chai.request(app)
        .post(`/api/member/pinjam-buku/${memberCode}`)
        .send(requestBody);

      expect(res).to.have.status(300);
      expect(res.body).to.equal('Sudah meminjam buku ini');
    });
  });
});

describe('API Member Controller', () => {
  before(async () => {
    await BorrowedBooks.destroy({ where: {} });
    await Book.destroy({ where: {} });
    await Book.bulkCreate(mockBook);
    await BorrowedBooks.bulkCreate(mockBorrowedBooks);
  });

  describe('GET /api/member/pengembalian-buku/:memberCode', () => {
    it('should return borrowed books for a member', async () => {
      const memberCode = mockMember[0].code;

      const res = await chai.request(app)
        .get(`/api/member/pengembalian-buku/${memberCode}`);

      expect(res).to.have.status(200);
      expect(res.body).to.be.an('array');
      expect(res.body.length).to.equal(2);
    });

    it('should return empty array if member has no borrowed books', async () => {
      const memberCode = mockMember[1].code; 

      const res = await chai.request(app)
        .get(`/api/member/pengembalian-buku/${memberCode}`);

      expect(res).to.have.status(200);
      expect(res.body).to.be.an('array');
      expect(res.body.length).to.equal(0);
    });
  });
});

describe('API Member Controller', () => {
  before(async () => {
    await BorrowedBooks.destroy({ where: {} });
    await Book.destroy({ where: {} });
    await Member.destroy({ where: {} });

    await Book.bulkCreate(mockBook);
    await Member.bulkCreate(mockMember);
    await BorrowedBooks.bulkCreate(mockBorrowedBooks);
  });

  describe('POST /api/member/pengembalian-buku/:memberCode', () => {
    it('should return books successfully and update stock', async () => {
      const memberCode = 'M001';
      const requestBody = { bookCode: ['JK-45', 'TW-11'] };

      const res = await chai.request(app)
        .post(`/api/member/pengembalian-buku/${memberCode}`)
        .send(requestBody);

      expect(res).to.have.status(200);
      expect(res.body).to.equal('Berhasil Mengembalikan Buku');

      const returnedBooks = await BorrowedBooks.findAll({ where: { memberCode, status: 'returned' } });
      expect(returnedBooks).to.have.lengthOf(2); 
      const updatedBooks = await Book.findAll({ where: { code: requestBody.bookCode } });
      updatedBooks.forEach(book => {
        expect(book.stock).to.equal(2); 
      });
    });

    it('should penalize member for late return', async () => {
      const memberCode = 'M001';
      const lateBookCode = 'JK-45';
      const requestBody = { bookCode: [lateBookCode] };

      const lateReturnDate = new Date();
      lateReturnDate.setDate(lateReturnDate.getDate() + 5);

      await BorrowedBooks.update({ returnedAt: lateReturnDate }, {
        where: { memberCode, bookCode: lateBookCode }
      });

      const res = await chai.request(app)
        .post(`/api/member/pengembalian-buku/${memberCode}`)
        .send(requestBody);

      expect(res).to.have.status(200);
      expect(res.body).to.equal('Berhasil Mengembalikan Buku');

      const penalizedMember = await Member.findOne({ where: { code: memberCode } });
      expect(penalizedMember.status).to.equal('penalized');
      expect(penalizedMember.penaltyTime).to.not.be.null;
    });
  });
});