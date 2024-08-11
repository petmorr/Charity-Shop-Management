const { validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const saltRounds = 10;

exports.getManageVolunteers = (req, res, usersDb, logger) => {
  if (!req.session.user || req.session.user.role !== 'manager') {
    logger.warn('Unauthorized access to manage volunteers');
    return res.status(403).json({ error: 'Unauthorized access' });
  }

  usersDb.find({ role: 'volunteer' }, (err, volunteers) => {
    if (err) {
      logger.error('Error loading volunteers:', err);
      return res.status(500).json({ error: 'Failed to load volunteers. Please try again.' });
    }
    logger.info('Displayed manage volunteers page', { volunteers });
    return res.status(200).json({ volunteers });
  });
};

exports.postAddVolunteer = (req, res, usersDb, logger) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    logger.warn('Validation errors on add volunteer:', { errors: errors.array() });
    return res.status(400).json({ error: 'Validation failed', details: errors.array() });
  }

  const newUser = {
    username: req.body.username,
    password: req.body.password,
    email: req.body.email,
    role: 'volunteer'
  };

  usersDb.findOne({ username: newUser.username }, (err, user) => {
    if (err) {
      logger.error('Failed to add volunteer:', err);
      return res.status(500).json({ error: 'Failed to add volunteer. Please try again.' });
    }

    if (user) {
      logger.warn('Attempt to add duplicate username:', { username: newUser.username });
      return res.status(409).json({ error: 'Username already exists' });
    }

    bcrypt.hash(newUser.password, saltRounds, (err, hash) => {
      if (err) {
        logger.error('Failed to hash password:', err);
        return res.status(500).json({ error: 'Failed to add volunteer. Please try again.' });
      }

      newUser.password = hash;

      usersDb.insert(newUser, (err, newDoc) => {
        if (err) {
          logger.error('Failed to add volunteer:', err);
          return res.status(500).json({ error: 'Failed to add volunteer. Please try again.' });
        }
        logger.info('Volunteer added successfully:', { newDoc });
        return res.status(201).json({ message: 'Volunteer added successfully' });
      });
    });
  });
};

exports.deleteVolunteer = (req, res, usersDb, logger) => {
  const volunteerId = req.params.id;
  logger.info('Deleting volunteer', { volunteerId });

  usersDb.remove({ _id: volunteerId, role: 'volunteer' }, {}, (err, numRemoved) => {
    if (err || numRemoved === 0) {
      logger.error('Failed to delete volunteer:', { volunteerId, err });
      return res.status(500).json({ error: 'Failed to delete volunteer. Please try again.' });
    }
    logger.info('Volunteer deleted successfully:', { volunteerId });
    return res.status(200).json({ message: 'Volunteer deleted successfully' });
  });
};