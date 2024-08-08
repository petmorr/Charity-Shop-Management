const express = require('express');
const itemsDb = require('../models/item');
const router = express.Router();

// Route to display the manage items page
router.get('/', (req, res) => {
  if (!req.session.user) {
    return res.redirect('/auth/login');
  }

  itemsDb.find({}, (err, items) => {
    if (err) return res.status(500).send(err);
    res.render('manage-items', { title: 'Manage Items', items: items, user: req.session.user });
  });
});

// API route to handle adding a new item
router.post('/api', (req, res) => {
  const newItem = req.body;
  itemsDb.insert(newItem, (err, item) => {
    if (err) return res.status(500).send(err);
    res.redirect('/manage-items');
  });
});

// API route to handle updating an item
router.put('/api/:id', (req, res) => {
  const itemId = req.params.id;
  const updatedItem = req.body;
  itemsDb.update({ _id: itemId }, { $set: updatedItem }, {}, (err, numReplaced) => {
    if (err) return res.status(500).send(err);
    res.sendStatus(200);
  });
});

// API route to handle deleting an item
router.delete('/api/:id', (req, res) => {
  const itemId = req.params.id;
  itemsDb.remove({ _id: itemId }, {}, (err, numRemoved) => {
    if (err) return res.status(500).send(err);
    res.sendStatus(200);
  });
});

module.exports = router;