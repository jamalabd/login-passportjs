// env variables
require('dotenv').config();

// dependancie
const express = require('express');
const app = express();
const path = require('path');
const bcrypt = require('bcrypt');
const passport = require('passport');
const flash = require('express-flash');
const session = require('express-session');
const initializeLocalStrategy = require('./passportConfig.js');
const { read } = require('fs');
// store
const users = [];

// init passport strategy
initializeLocalStrategy(
  passport,
  (email) => users.find((user) => user.email == email),
  (id) => users.find((user) => user.id == id)
);

// middel ware
app.use(
  express.urlencoded({
    extended: false,
  })
);

app.use(express.json());

app.use(express.static(path.join(__dirname, '/view')));
app.use(flash());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

// routes
app.get('/account', checkAuth, (req, res) => {
  res.sendFile(path.join(__dirname + '/view/account.html'));
});
// login routes
app.get('/login', checkAlreadyAuth, (req, res) => {
  res.sendFile(path.join(__dirname + '/view/login.html'));
});

app.delete('./logout', (req, res) => {
  req.logOut();
  req.redirect('./login');
});
app.post(
  '/login',
  checkAlreadyAuth,
  passport.authenticate('local', {
    successRedirect: '/account',
    failureRedirect: '/login',
    failureFlash: true,
  })
);
// register routes
app.get('/register', checkAlreadyAuth, (req, res) => {
  res.sendFile(path.join(__dirname + '/view/register.html'));
});

app.post('/register', checkAlreadyAuth, async (req, res) => {
  try {
    const user = users.find((user) => user.email == req.body.email);
    if (user) return res.status(400).json({ email: 'User already exists' });
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    users.push({
      id: Date.now().toString(),
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
    });
    res.redirect('/login');
    console.log(users);
  } catch (error) {
    res.redirect('/register');
    console.log(error);
  }
});
// init ports
const port = process.env.PORT || 7000;

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});

function checkAuth(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('./login');
}

function checkAlreadyAuth(req, res, next) {
  if (req.isAuthenticated()) {
    res.redirect('./account');
  }
  return next();
}
