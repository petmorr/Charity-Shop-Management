const express = require('express');
const usersDb = require('../models/user');
const router = express.Router();

router.post('/', (req, res) => {
  const newUser = req.body;
  usersDb.insert(newUser, (err, user) => {
    if (err) return res.status(500).send(err);
    res.status(201).send(user);
  });
});

router.delete('/:id', (req, res) => {
  const userId = req.params.id;
  usersDb.remove({ _id: userId }, {}, (err, numRemoved) => {
    if (err) return res.status(500).send(err);
    res.sendStatus(200);
  });
});

module.exports = router;