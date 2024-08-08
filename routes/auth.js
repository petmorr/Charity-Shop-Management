const express = require('express');
const usersDb = require('../models/user');
const router = express.Router();

// Route to display the login page
router.get('/login', (req, res) => {
  res.render('login', { title: 'Login' });
});

// Route to handle login form submission
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  usersDb.findOne({ username, password }, (err, user) => {
    if (err || !user) return res.status(401).send('Login failed');
    req.session.user = user;
    res.redirect('/dashboard');
  });
});

// Route to handle logout
router.post('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/auth/login');
});

module.exports = router;