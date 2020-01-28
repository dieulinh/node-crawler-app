const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const { getUsers, createUser } = require('./server/users');
var app = express();
var port = process.env.PORT|3001;

var quotes = [
  {
      id: 1,
      quote: "The best is yet to come",
      author: "Unknown",
      year: 2000
  },
  {
      id: 2,
      quote: "This is a quote",
      author: "First Last",
      year: 1930
  },
  {
      id: 3,
      quote: "This is another quote",
      author: "First2 Last2",
      year: 1910
  }
];
app.use(bodyParser.json());
app.set('view engine', 'pug');
app.get('/', (reques, response) => {
  var message = 'are you excited';
  response.render('pug/index', {title: 'Hello world from Express', message: 'Please login'});
});

app.get('/users', getUsers);
app.post('/users', createUser);
app.get('/quotes', (req, res) => {
  res.json(quotes);
});
app.listen(port, function() {
  console.log('Express app listening on port: ', port);
});