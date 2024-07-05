const { Book } = require('../models');

function index(req, res) {
  Book.findAll()
    .then((books) => {
      res.render('pages/book/index', { title: 'Member', books, currentUrl: req.originalUrl });
    })
    .catch((err) => {
      res.send(err);
    });
}

module.exports = {
  index
};
