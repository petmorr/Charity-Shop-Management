const express = require('express');
const router = express.Router();

module.exports = (itemsDb) => {
  // Example route
  router.get('/', (req, res) => {
    itemsDb.find({}, (err, items) => {
      if (err) return res.status(500).send(err);
      res.render('items', { title: 'Items in Stock', items: items });
    });
  });

  return router;
};