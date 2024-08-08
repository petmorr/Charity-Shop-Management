const express = require('express');
const router = express.Router();

// About Us route
router.get('/about', (req, res) => {
  res.render('about', { title: 'About Us', user: req.session.user });
});

module.exports = router;