const express = require('express');
const usersDb = require('../models/user');
const router = express.Router();

router.post('/login', (req, res) => {
  const { username, password } = req.body;
  usersDb.findOne({ username, password }, (err, user) => {
    if (err || !user) return res.status(401).send('Login failed');
    req.session.user = user;
    res.redirect('/dashboard');
  });
});

router.post('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/login');
});

module.exports = router;