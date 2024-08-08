const express = require('express');
const itemsDb = require('../models/item');
const router = express.Router();

router.get('/', (req, res) => {
  itemsDb.find({}, (err, items) => {
    if (err) return res.status(500).send(err);
    res.render('items', { title: 'Items in Stock', items: items });
  });
});

router.post('/', (req, res) => {
  const newItem = req.body;
  itemsDb.insert(newItem, (err, item) => {
    if (err) return res.status(500).send(err);
    res.status(201).send(item);
  });
});

router.put('/:id', (req, res) => {
  const itemId = req.params.id;
  const updatedItem = req.body;
  itemsDb.update({ _id: itemId }, { $set: updatedItem }, {}, (err, numReplaced) => {
    if (err) return res.status(500).send(err);
    res.sendStatus(200);
  });
});

router.delete('/:id', (req, res) => {
  const itemId = req.params.id;
  itemsDb.remove({ _id: itemId }, {}, (err, numRemoved) => {
    if (err) return res.status(500).send(err);
    res.sendStatus(200);
  });
});

module.exports = router;