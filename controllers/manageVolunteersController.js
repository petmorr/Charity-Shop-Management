const { check, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const saltRounds = 10;

exports.getManageVolunteers = (req, res, usersDb, logger) => {
  if (!req.session.user || req.session.user.role !== 'manager') {
    req.flash('error', 'Unauthorized access.');
    logger.warn('Unauthorized access to manage volunteers');
    return res.redirect('/dashboard');
  }

  usersDb.find({ role: 'volunteer' }, (err, volunteers) => {
    if (err) {
      req.flash('error', 'Failed to load volunteers. Please try again.');
      logger.error('Error loading volunteers:', err);
      return res.redirect('/dashboard');
    }
    res.render('manage-volunteers', { title: 'Manage Volunteers', volunteers: volunteers });
    logger.info('Displayed manage volunteers page', { volunteers });
  });
};

exports.postAddVolunteer = (req, res, usersDb, logger) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    req.flash('error', errors.array().map(error => error.msg).join('. '));
    logger.warn('Validation errors on add volunteer:', { errors: errors.array() });
    return res.redirect('/manage-volunteers');
  }

  const newUser = {
    username: req.body.username,
    password: req.body.password,
    email: req.body.email,
    role: 'volunteer'
  };

  // Check if the username already exists
  usersDb.findOne({ username: newUser.username }, (err, user) => {
    if (err) {
      req.flash('error', 'Failed to add volunteer. Please try again.');
      logger.error('Failed to add volunteer:', err);
      return res.redirect('/manage-volunteers');
    }

    if (user) {
      req.flash('error', 'Username already exists. Please choose another one.');
      logger.warn('Attempt to add duplicate username:', { username: newUser.username });
      return res.redirect('/manage-volunteers');
    }

    // Hash the password before saving
    bcrypt.hash(newUser.password, saltRounds, (err, hash) => {
      if (err) {
        req.flash('error', 'Failed to add volunteer. Please try again.');
        logger.error('Failed to hash password:', err);
        return res.redirect('/manage-volunteers');
      }

      newUser.password = hash;

      logger.info('Adding new volunteer', { newUser });

      usersDb.insert(newUser, (err, newDoc) => {
        if (err) {
          req.flash('error', 'Failed to add volunteer. Please try again.');
          logger.error('Failed to add volunteer:', err);
          return res.redirect('/manage-volunteers');
        }
        req.flash('success', 'Volunteer added successfully.');
        logger.info('Volunteer added successfully:', { newDoc });
        return res.redirect('/manage-volunteers');
      });
    });
  });
};

exports.deleteVolunteer = (req, res, usersDb, logger) => {
  const volunteerId = req.params.id;
  logger.info('Deleting volunteer', { volunteerId });

  usersDb.remove({ _id: volunteerId, role: 'volunteer' }, {}, (err, numRemoved) => {
    if (err) {
      req.flash('error', 'Failed to delete volunteer. Please try again.');
      logger.error('Failed to delete volunteer:', { volunteerId, err });
      return res.redirect('/manage-volunteers');
    }
    req.flash('success', 'Volunteer deleted successfully.');
    logger.info('Volunteer deleted successfully:', { volunteerId });
    return res.redirect('/manage-volunteers');
  });
};