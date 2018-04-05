const express = require('express');
const Book = require('../models/book');

const router = express.Router();
const USER_ERROR = 422;
const SERVER_ERROR = 500;

router.get('/', async (req, res) => {
  const { id } = req.query;
  try {
    const book = await Book.findById(id).populate('owner', 'username');
    return res.send(book);
  }
  catch(error) {
    return res.status(SERVER_ERROR).send({ error });
  }
});

router.get('/:owner', async (req,res) => {
  const { owner } = req.params;

  try {
    const books = await Book.find({ owner });
    return res.send(books);
  }
  catch(error) {
    return res.status(SERVER_ERROR).send({ error });
  }
});

router.post('/', async (req, res) => {
  const { fields } = req.body;
  if (typeof fields !== 'object' || fields === null)
    return res.status(USER_ERROR).json({ error: 'Must provide fields' });

  try {
    const book = new Book(fields);
    await book.save();
    return res.send(book);
  }
  catch(error) {
    return res.status(SERVER_ERROR).send({ error });
  }
});

router.patch('/', async (req, res) => {
  const { id, fields } = req.body;
  if (typeof fields !== 'object' || fields === null)
    return res.status(USER_ERROR).json({ error: 'Must provide fields' });

  try {
    const book = await Book.findById(id);
    if(!book)
      return res.status(500).send({ error: `Could not find book with id ${id}` });
    
    Object.entries(fields).forEach(([key, value]) => {
      book[key] = value;
    });

    await book.save();
    return res.send(book);
  }
  catch (error) {
    return res.status(SERVER_ERROR).send({ error });
  }
});

router.delete('/', (req, res)=>{
  const { id } = req.body;

  Book.findByIdAndRemove(id)
  .exec()
  .then(book => {
    return res.json(true);
  })
  .catch(error => {
    return res.status(SERVER_ERROR).send({ error });
  });
})

module.exports = router;