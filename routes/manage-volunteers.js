const express = require('express');
const { check, validationResult } = require('express-validator');
const usersDb = require('../models/user');
const router = express.Router();

// Route to display the manage volunteers page
router.get('/', (req, res) => {
  if (!req.session.user || req.session.user.role !== 'manager') {
    req.flash('error', 'You do not have permission to view this page.');
    return res.redirect('/dashboard');
  }

  usersDb.find({ role: 'volunteer' }, (err, users) => {
    if (err) {
      req.flash('error', 'Failed to load volunteers. Please try again.');
      return res.redirect('/dashboard');
    }
    res.render('manage-volunteers', { title: 'Manage Volunteers', users: users, user: req.session.user });
  });
});

// API route to handle adding a new volunteer
router.post('/api', [
  check('username').trim().isLength({ min: 3 }).escape().withMessage('Username must be at least 3 characters long'),
  check('email').isEmail().normalizeEmail().withMessage('Please enter a valid email'),
  check('password').isLength({ min: 5 }).escape().withMessage('Password must be at least 5 characters long')
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    req.flash('error', errors.array().map(error => error.msg).join('. '));
    return res.redirect('/manage-volunteers');
  }

  const { username, password, email } = req.body;
  usersDb.insert({ username, password, email, role: 'volunteer' }, (err, user) => {
    if (err) {
      req.flash('error', 'Failed to add volunteer. Please try again.');
      return res.redirect('/manage-volunteers');
    }
    req.flash('success', 'Volunteer added successfully.');
    res.redirect('/manage-volunteers');
  });
});

// API route to handle deleting a volunteer
router.delete('/api/:id', (req, res) => {
  const userId = req.params.id;
  usersDb.remove({ _id: userId }, {}, (err, numRemoved) => {
    if (err) {
      req.flash('error', 'Failed to delete volunteer. Please try again.');
      return res.redirect('/manage-volunteers');
    }
    req.flash('success', 'Volunteer deleted successfully.');
    res.redirect('/manage-volunteers');
  });
});

module.exports = router;