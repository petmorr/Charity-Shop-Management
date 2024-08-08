exports.getDashboard = (req, res, logger) => {
    if (!req.session.user) {
      req.flash('error', 'Please log in to access the dashboard.');
      logger.warn('Unauthorized access to dashboard');
      return res.redirect('/auth/login');
    }
  
    const user = req.session.user;
    if (user.role === 'manager') {
      res.render('manager-dashboard', { title: 'Manager Dashboard', user });
      logger.info('Accessed manager dashboard');
    } else {
      res.render('volunteer-dashboard', { title: 'Volunteer Dashboard', user });
      logger.info('Accessed volunteer dashboard');
    }
};  