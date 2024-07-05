const { Book } = require('../../models');

function index(req, res) {
  Book.findAll()
    .then((books) => {
      res.json(books);
    })
    .catch((err) => {
      res.send(err);
    });
}

module.exports = {
  index
};
