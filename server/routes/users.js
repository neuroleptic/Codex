const express = require('express');
const User = require('../models/user');

const router = express.Router();
const SERVER_ERROR = 500;

router.get('/', async (req, res) => { 
  try {
    const users = await User.find({});
    return res.send(users);
  } 
  catch(error) {
    return res.status(SERVER_ERROR).send({ error });
  }
});

module.exports = router;