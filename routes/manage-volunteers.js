const express = require('express');
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
router.post('/api', (req, res) => {
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
    res.sendStatus(200);
  });
});

module.exports = router;