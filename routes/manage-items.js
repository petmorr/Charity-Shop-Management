const express = require('express');
const { check, validationResult } = require('express-validator');
const itemsDb = require('../models/item');
const router = express.Router();

// Route to display the manage items page
router.get('/', (req, res) => {
  if (!req.session.user) {
    req.flash('error', 'Please log in to manage items.');
    return res.redirect('/auth/login');
  }

  itemsDb.find({}, (err, items) => {
    if (err) {
      req.flash('error', 'Failed to load items. Please try again.');
      return res.redirect('/dashboard');
    }
    res.render('manage-items', { title: 'Manage Items', items: items, user: req.session.user });
  });
});

// API route to handle adding a new item
router.post('/api', [
  check('name').trim().isLength({ min: 1 }).escape().withMessage('Item name is required'),
  check('description').trim().isLength({ min: 1 }).escape().withMessage('Item description is required'),
  check('price').isFloat({ min: 0 }).withMessage('Item price must be a positive number'),
  check('store').trim().isLength({ min: 1 }).escape().withMessage('Store is required')
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    req.flash('error', errors.array().map(error => error.msg).join('. '));
    return res.redirect('/manage-items');
  }

  const newItem = req.body;
  itemsDb.insert(newItem, (err, item) => {
    if (err) {
      req.flash('error', 'Failed to add item. Please try again.');
      return res.redirect('/manage-items');
    }
    req.flash('success', 'Item added successfully.');
    res.redirect('/manage-items');
  });
});

// API route to handle updating an item
router.put('/api/:id', [
  check('name').trim().isLength({ min: 1 }).escape().withMessage('Item name is required'),
  check('description').trim().isLength({ min: 1 }).escape().withMessage('Item description is required'),
  check('price').isFloat({ min: 0 }).withMessage('Item price must be a positive number'),
  check('store').trim().isLength({ min: 1 }).escape().withMessage('Store is required')
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    req.flash('error', errors.array().map(error => error.msg).join('. '));
    return res.redirect('/manage-items');
  }

  const itemId = req.params.id;
  const updatedItem = req.body;
  itemsDb.update({ _id: itemId }, { $set: updatedItem }, {}, (err, numReplaced) => {
    if (err) {
      req.flash('error', 'Failed to update item. Please try again.');
      return res.redirect('/manage-items');
    }
    req.flash('success', 'Item updated successfully.');
    res.redirect('/manage-items');
  });
});

// API route to handle deleting an item
router.delete('/api/:id', (req, res) => {
  const itemId = req.params.id;
  itemsDb.remove({ _id: itemId }, {}, (err, numRemoved) => {
    if (err) {
      req.flash('error', 'Failed to delete item. Please try again.');
      return res.redirect('/manage-items');
    }
    req.flash('success', 'Item deleted successfully.');
    res.redirect('/manage-items');
  });
});

module.exports = router;