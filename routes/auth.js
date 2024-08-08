const express = require('express');
const { check, validationResult } = require('express-validator');
const usersDb = require('../models/user');
const router = express.Router();

// Route to display the registration page
router.get('/register', (req, res) => {
  res.render('register', { title: 'Register' });
});

// API route to handle registration form submission
router.post('/api/register', [
  check('username').trim().isLength({ min: 3 }).escape().withMessage('Username must be at least 3 characters long'),
  check('email').isEmail().normalizeEmail().withMessage('Please enter a valid email'),
  check('password').isLength({ min: 5 }).escape().withMessage('Password must be at least 5 characters long')
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    req.flash('error', errors.array().map(error => error.msg).join('. '));
    return res.redirect('/auth/register');
  }

  const { username, password, email } = req.body;
  usersDb.insert({ username, password, email, role: 'volunteer' }, (err, user) => {
    if (err) {
      req.flash('error', 'Registration failed. Please try again.');
      return res.redirect('/auth/register');
    }
    req.flash('success', 'Registration successful. Please log in.');
    res.redirect('/auth/login');
  });
});

// Route to display the login page
router.get('/login', (req, res) => {
  res.render('login', { title: 'Login' });
});

// API route to handle login form submission
router.post('/api/login', [
  check('username').trim().escape(),
  check('password').trim().escape()
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    req.flash('error', errors.array().map(error => error.msg).join('. '));
    return res.redirect('/auth/login');
  }

  const { username, password } = req.body;
  usersDb.findOne({ username, password }, (err, user) => {
    if (err || !user) {
      req.flash('error', 'Login failed. Please check your credentials and try again.');
      return res.redirect('/auth/login');
    }
    req.session.user = user;
    req.flash('success', 'Login successful.');
    res.redirect('/dashboard');
  });
});

// Route to handle logout
router.get('/logout', (req, res) => {
  req.flash('success', 'Logged out successfully.'); // Set the flash message
  req.session.destroy((err) => {
    if (err) {
      req.flash('error', 'Failed to logout. Please try again.');
      return res.redirect('/dashboard');
    }
    res.redirect('/auth/login');
  });
});

module.exports = router;