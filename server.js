// dependancie
const express = require('express');
const app = express();
const path = require('path');

// middel ware
app.use(
  express.urlencoded({
    extended: false,
  })
);

app.use(express.json());

app.use(express.static(path.join(__dirname, '/view')));

// routes
app.get('/account', (req, res) => {
  res.sendFile(path.join(__dirname + '/view/account.html'));
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname + '/view/login.html'));
});

app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname + '/view/register.html'));
});

// init ports
const port = process.env.PORT || 7000;

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
