const express = require('express');
const router = express.Router();

// Route to display the dashboard
router.get('/', (req, res) => {
  if (!req.session.user) {
    return res.redirect('/auth/login');
  }

  const user = req.session.user;
  if (user.role === 'manager') {
    res.render('manager-dashboard', { title: 'Manager Dashboard', user });
  } else {
    res.render('volunteer-dashboard', { title: 'Volunteer Dashboard', user });
  }
});

module.exports = router;