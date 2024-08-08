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

  usersDb.findOne({ username: username }, (err, user) => {
    if (err || !user) {
      req.flash('error', 'Invalid username or password');
      logger.warn('Invalid login attempt', { username });
      return res.redirect('/auth/login');
    }

    // Check if the password is plain text (existing users) or hashed (new users)
    if (user.password === password) {
      // Plain text password match for existing user
      req.session.user = user;
      req.flash('success', 'Successfully logged in');
      logger.info('User logged in with plain text password:', { username });
      return res.redirect('/dashboard');
    } else {
      // Compare hashed passwords for new users
      bcrypt.compare(password, user.password, (err, result) => {
        if (result) {
          req.session.user = user;
          req.flash('success', 'Successfully logged in');
          logger.info('User logged in with hashed password:', { username });
          return res.redirect('/dashboard');
        } else {
          req.flash('error', 'Invalid username or password');
          logger.warn('Invalid login attempt', { username });
          return res.redirect('/auth/login');
        }
      });
    }
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
    role: 'volunteer' // Default role, can be changed based on your application's logic
  };

  // Check if the username already exists
  usersDb.findOne({ username: newUser.username }, (err, user) => {
    if (err) {
      req.flash('error', 'Failed to register. Please try again.');
      logger.error('Failed to register user:', err);
      return res.redirect('/auth/register');
    }

    if (user) {
      req.flash('error', 'Username already exists. Please choose another one.');
      logger.warn('Attempt to register duplicate username:', { username: newUser.username });
      return res.redirect('/auth/register');
    }

    // Hash the password before saving
    bcrypt.hash(newUser.password, saltRounds, (err, hash) => {
      if (err) {
        req.flash('error', 'Failed to register. Please try again.');
        logger.error('Failed to hash password:', err);
        return res.redirect('/auth/register');
      }

      newUser.password = hash;

      logger.info('Registering new user', { newUser });

      usersDb.insert(newUser, (err, newDoc) => {
        if (err) {
          req.flash('error', 'Failed to register. Please try again.');
          logger.error('Failed to register user:', err);
          return res.redirect('/auth/register');
        }
        req.flash('success', 'User registered successfully.');
        logger.info('User registered successfully:', { newDoc });
        return res.redirect('/auth/login');
      });
    });
  });
};

exports.logout = (req, res, logger) => {
  if (req.session) {
    req.session.destroy(err => {
      if (err) {
        logger.error('Failed to destroy session:', err);
        return res.redirect('/dashboard');
      } else {
        res.redirect('/auth/login');
      }
    });
  } else {
    res.redirect('/auth/login');
  }
};