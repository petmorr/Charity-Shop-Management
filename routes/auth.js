const express = require('express');
const { check, validationResult } = require('express-validator');
const router = express.Router();

module.exports = (usersDb) => {
  // Login page
  router.get('/login', (req, res) => {
    res.render('login', { title: 'Login' });
  });

  // Handle login
  router.post('/api/login', [
    check('username').trim().notEmpty().withMessage('Username is required').escape(),
    check('password').trim().notEmpty().withMessage('Password is required').escape()
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

  // Handle logout
  router.get('/logout', (req, res) => {
    req.flash('success', 'Logged out successfully.');
    req.session.destroy((err) => {
      if (err) {
        req.flash('error', 'Failed to logout. Please try again.');
        return res.redirect('/dashboard');
      }
      res.redirect('/auth/login');
    });
  });

  return router;
};