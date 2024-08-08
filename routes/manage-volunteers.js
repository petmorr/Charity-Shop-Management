const express = require('express');
const { check, validationResult } = require('express-validator');
const router = express.Router();

module.exports = (usersDb) => {
  // Route to display the manage volunteers page
  router.get('/', (req, res) => {
    if (!req.session.user || req.session.user.role !== 'manager') {
      req.flash('error', 'You do not have permission to view this page.');
      return res.redirect('/dashboard');
    }

    usersDb.find({}, (err, users) => {
      if (err) {
        req.flash('error', 'Failed to load volunteers. Please try again.');
        return res.redirect('/dashboard');
      }
      res.render('manage-volunteers', { title: 'Manage Volunteers', users: users, user: req.session.user });
    });
  });

  // API route to handle adding a new volunteer or manager
  router.post('/api', [
    check('username').trim().isLength({ min: 3 }).escape().withMessage('Username must be at least 3 characters long'),
    check('email').isEmail().normalizeEmail().withMessage('Please enter a valid email'),
    check('password').isLength({ min: 5 }).escape().withMessage('Password must be at least 5 characters long'),
    check('role').isIn(['volunteer', 'manager']).withMessage('Invalid role selected')
  ], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      req.flash('error', errors.array().map(error => error.msg).join('. '));
      return res.redirect('/manage-volunteers');
    }

    const { username, password, email, role } = req.body;
    usersDb.insert({ username, password, email, role }, (err, user) => {
      if (err) {
        req.flash('error', 'Failed to add volunteer or manager. Please try again.');
        return res.redirect('/manage-volunteers');
      }
      req.flash('success', 'User added successfully.');
      res.redirect('/manage-volunteers');
    });
  });

  // API route to handle deleting a volunteer or manager
  router.delete('/api/:id', (req, res) => {
    const userId = req.params.id;
    usersDb.remove({ _id: userId }, {}, (err, numRemoved) => {
      if (err) {
        req.flash('error', 'Failed to delete user. Please try again.');
        return res.redirect('/manage-volunteers');
      }
      req.flash('success', 'User deleted successfully.');
      res.redirect('/manage-volunteers');
    });
  });

  return router;
};