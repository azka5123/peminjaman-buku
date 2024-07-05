const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../index');
const expect = chai.expect;
const { Book, BorrowedBooks } = require('../models');

chai.use(chaiHttp);

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

describe('API Member Controller', () => {
    before(async () => {
      await BorrowedBooks.destroy({ where: {} });
      await Book.destroy({ where: {} });
      await Book.bulkCreate(mockBook);
    });
  
    describe('GET /api/book/index', () => {
      it('should return available books', async () => {
        const res = await chai.request(app).get(`/api/book/index/`);
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('array');
      });
    });
  });