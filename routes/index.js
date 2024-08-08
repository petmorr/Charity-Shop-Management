const express = require('express');
const path = require('path');
const NeDB = require('nedb');
const router = express.Router();

// Initialize the items database
const itemsDb = new NeDB({ filename: path.join(__dirname, '../data/items.db'), autoload: true });

// About Us page
router.get('/about', (req, res) => {
  res.render('about', { title: 'About Us' });
});

// Items page
router.get('/items', (req, res) => {
  itemsDb.find({}, (err, items) => {
    if (err) {
      console.error('Error fetching items:', err);
      return res.status(500).send(err);
    }
    console.log('Items fetched:', items); // Debug statement
    res.render('items', { title: 'Items in Stock', items: items });
  });
});

module.exports = router;