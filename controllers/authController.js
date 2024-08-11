const { validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const saltRounds = 10;

exports.getLogin = (req, res) => {
  res.render('login', { title: 'Login' });
};

exports.postLogin = (req, res, usersDb, logger) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    logger.warn('Validation errors on login:', { errors: errors.array() });
    return res.status(400).json({ error: 'Validation failed', details: errors.array() });
  }

  const { username, password } = req.body;

  usersDb.findOne({ username }, (err, user) => {
    if (err || !user) {
      logger.warn('Invalid login attempt', { username });
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    bcrypt.compare(password, user.password, (err, result) => {
      if (result) {
        req.session.user = user;
        logger.info('User logged in successfully:', { username });
        return res.status(200).json({ message: 'Successfully logged in' });
      } else {
        logger.warn('Invalid login attempt', { username });
        return res.status(401).json({ error: 'Invalid username or password' });
      }
    });
  });
};

exports.getRegister = (req, res) => {
  res.render('register', { title: 'Register' });
};

exports.postRegister = (req, res, usersDb, logger) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    logger.warn('Validation errors on register:', { errors: errors.array() });
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
      logger.error('Error checking username:', err);
      return res.status(500).json({ error: 'Failed to register. Please try again.' });
    }

    if (user) {
      logger.warn('Attempt to register duplicate username:', { username: newUser.username });
      return res.status(409).json({ error: 'Username already exists' });
    }

    bcrypt.hash(newUser.password, saltRounds, (err, hash) => {
      if (err) {
        logger.error('Failed to hash password:', err);
        return res.status(500).json({ error: 'Failed to register. Please try again.' });
      }

      newUser.password = hash;

      usersDb.insert(newUser, (err, newDoc) => {
        if (err) {
          logger.error('Failed to register user:', err);
          return res.status(500).json({ error: 'Failed to register. Please try again.' });
        }
        logger.info('User registered successfully:', { newDoc });
        return res.status(201).json({ message: 'User registered successfully' });
      });
    });
  });
};

exports.logout = (req, res, logger) => {
  if (req.session) {
    req.session.destroy(err => {
      if (err) {
        logger.error('Failed to destroy session:', err);
        return res.status(500).json({ error: 'Failed to log out. Please try again.' });
      } else {
        logger.info('User logged out successfully');
        return res.status(200).json({ message: 'Successfully logged out' });
      }
    });
  } else {
    return res.status(404).json({ error: 'No active session found' });
  }
};