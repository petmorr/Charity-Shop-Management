const { validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const saltRounds = 10;

exports.getLogin = (req, res) => {
  res.render('login', { title: 'Login' });
};

exports.postLogin = (req, res, usersDb, logger) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    req.flash('error', errors.array().map(error => error.msg).join('. '));
    logger.warn('Validation errors on login:', { errors: errors.array() });
    return res.redirect('/auth/login');
  }

  const { username, password } = req.body;

  usersDb.findOne({ username }, (err, user) => {
    if (err || !user) {
      req.flash('error', 'Invalid username or password');
      logger.warn('Invalid login attempt', { username });
      return res.redirect('/auth/login');
    }

    bcrypt.compare(password, user.password, (err, result) => {
      if (result) {
        req.session.user = user;
        req.flash('success', 'Successfully logged in');
        logger.info('User logged in successfully:', { username });
        return res.redirect('/dashboard');
      } else {
        req.flash('error', 'Invalid username or password');
        logger.warn('Invalid login attempt', { username });
        return res.redirect('/auth/login');
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
    req.flash('error', errors.array().map(error => error.msg).join('. '));
    logger.warn('Validation errors on register:', { errors: errors.array() });
    return res.redirect('/auth/register');
  }

  const newUser = {
    username: req.body.username,
    password: req.body.password,
    email: req.body.email,
    role: 'volunteer'
  };

  usersDb.findOne({ username: newUser.username }, (err, user) => {
    if (err) {
      req.flash('error', 'Failed to register. Please try again.');
      logger.error('Error checking username:', err);
      return res.redirect('/auth/register');
    }

    if (user) {
      req.flash('error', 'Username already exists');
      logger.warn('Attempt to register duplicate username:', { username: newUser.username });
      return res.redirect('/auth/register');
    }

    bcrypt.hash(newUser.password, saltRounds, (err, hash) => {
      if (err) {
        req.flash('error', 'Failed to register. Please try again.');
        logger.error('Failed to hash password:', err);
        return res.redirect('/auth/register');
      }

      newUser.password = hash;

      usersDb.insert(newUser, (err, newDoc) => {
        if (err) {
          req.flash('error', 'Failed to register. Please try again.');
          logger.error('Failed to register user:', err);
          return res.redirect('/auth/register');
        }
        req.flash('success', 'Registration successful, please login');
        logger.info('User registered successfully:', { newDoc });
        return res.redirect('/auth/login');
      });
    });
  });
};

exports.logout = (req, res, logger) => {
  req.session.destroy(err => {
    if (err) {
      logger.error(`Error during logout: ${err.message}`);
      res.status(500).send('Internal Server Error');
    } else {
      req.flash('success', 'Successfully logged out');
      res.redirect('/auth/login');
    }
  });
};