const express = require('express');
const router = express.Router();

module.exports = (itemsDb) => {
  // About Us page
  router.get('/about', (req, res) => {
    res.render('about', { title: 'About Us' });
  });

  // Items page
  router.get('/items', (req, res) => {
    itemsDb.find({}, (err, items) => {
      if (err) return res.status(500).send(err);
      res.render('items', { title: 'Items in Stock', items: items });
    });
  });

  return router;
};