const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const config = require('./config/config').get(process.env.NODE_ENV);
const bookRoutes = require('./routes/book');
const booksRoutes = require('./routes/books');
const authRoutes = require('./routes/auth');
const usersRoutes = require('./routes/users');

const app = express();

mongoose.Promise = global.Promise;
mongoose.connect(config.DATABASE, { useMongoClient: true });

app.use(bodyParser.json());
app.use(cookieParser());

app.use(express.static('client/build'));

app.use('/', authRoutes);
app.use('/book', bookRoutes);
app.use('/books', booksRoutes);
app.use('/users', usersRoutes);

if(process.env.NODE_ENV === 'production') {
  const path = require('path');
  app.get('/*', (req,res) => {
    res.sendfile(path.resolve(__dirname, '../client','build','index.html'));
  });
}

const port = process.env.PORT || 3001;
app.listen(port, ()=>{
  console.log(`Server running on port ${port}`)
});