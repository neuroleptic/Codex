const express = require('express');
const { auth} = require('../middleware/auth');
const User = require('../models/user');

const router = express.Router();
const USER_ERROR = 422;
const SERVER_ERROR = 500;

router.get('/auth', auth, (req, res) => {
  res.json({
    isAuth: true,
    id: req.user._id,
    username: req.user.username
  });
});

router.get('/logout', auth, (req, res) => {
  req.user.deleteToken(req.token, (err, user) => {
    if(err) 
      return res.status(400).send(err);
    return res.sendStatus(200);
  });
});

router.post('/register', async (req, res)=>{
  const { fields } = req.body;
  if (typeof fields !== 'object' || fields === null)
    return res.status(USER_ERROR).json({ error: 'Must provide fields' });

  try {
    const user = new User(fields);
    await user.save();
    return res.send(user);
  }
  catch(error) {
    return res.status(SERVER_ERROR).send({ error });
  }
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if(!user)
      return res.json({isAuth: false, message: `Could not login user with username ${username}`});

    user.comparePassword(password, (err, isMatch) => {
      if(!isMatch || err) return res.json({
        isAuth: false,
        message: `Could not login user with username ${username}`
      });
      
      user.generateToken((error, user)=>{
        if(error) 
          return res.status(SERVER_ERROR).send({ error });
          
        return res.cookie('auth', user.token).json({
          isAuth: true,
          id: user._id,
          username: user.username
        });
      });
    });
  }
  catch (errpr) {
    return res.status(SERVER_ERROR).send({ error });
  }
});

module.exports = router;
