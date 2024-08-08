const express = require('express');
const usersDb = require('../models/user');
const router = express.Router();

// Route to display the registration page
router.get('/register', (req, res) => {
  res.render('register', { title: 'Register' });
});

// API route to handle registration form submission
router.post('/api/register', (req, res) => {
  const { username, password, email } = req.body;
  usersDb.insert({ username, password, email, role: 'volunteer' }, (err, user) => {
    if (err) return res.status(500).send('Registration failed');
    res.redirect('/auth/login');
  });
});

// Route to display the login page
router.get('/login', (req, res) => {
  res.render('login', { title: 'Login' });
});

// API route to handle login form submission
router.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  usersDb.findOne({ username, password }, (err, user) => {
    if (err || !user) return res.status(401).send('Login failed');
    req.session.user = user;
    res.redirect('/dashboard');
  });
});

// Route to handle logout
router.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).send('Failed to logout');
    }
    res.redirect('/auth/login');
  });
});

module.exports = router;