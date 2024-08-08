const express = require('express');
const router = express.Router();

module.exports = (usersDb) => {
  // Define your routes for users here, e.g.,
  router.get('/', (req, res) => {
    usersDb.find({}, (err, users) => {
      if (err) {
        console.error('Error fetching users:', err);
        return res.status(500).send(err);
      }
      res.render('users', { title: 'Users', users: users });
    });
  });

  return router;
};