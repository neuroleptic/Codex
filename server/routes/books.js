const express = require('express');
const Book = require('../models/book');

const router = express.Router();
const SERVER_ERROR = 500;

router.get('/', (req, res) => {
  const skip = parseInt(req.query.skip);
  const limit = parseInt(req.query.limit);
  const { order } = req.query;

  Book.find()
  .skip(skip)
  .sort({_id: order})
  .limit(limit)
  .exec()
  .then(books => {
    return res.send(books);
  })
  .catch(error => {
    return res.status(SERVER_ERROR).send({ error });
  });
});

module.exports = router;