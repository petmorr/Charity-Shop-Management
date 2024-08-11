const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");
const { validationResult } = require("express-validator");

exports.getLogin = (req, res) => {
  res.render("login", { title: "Login" });
};

exports.getRegister = (req, res) => {
  res.render("register", { title: "Register" });
};

exports.postLogin = async (req, res, usersDb, logger) => {
  const { username, password } = req.body;
  try {
    usersDb.findUserByUsername(username, (err, user) => {
      if (err) {
        logger.error(`Error during login: ${err.message}`);
        return res.status(500).send("Internal Server Error");
      }
      if (user && bcrypt.compareSync(password, user.password)) {
        req.session.userId = user._id;
        req.session.user = user; // Store user data in session
        req.flash("success", "Successfully logged in");
        return res.redirect("/dashboard");
      } else {
        req.flash("error", "Invalid username or password");
        return res.redirect("/auth/login");
      }
    });
  } catch (error) {
    logger.error(`Error during login: ${error.message}`);
    res.status(500).send("Internal Server Error");
  }
};

exports.postRegister = async (req, res, usersDb, logger) => {
  const { username, password, email } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    req.flash(
      "error",
      errors
        .array()
        .map((err) => err.msg)
        .join(". "),
    );
    return res.redirect("/auth/register");
  }

  try {
    usersDb.findUserByUsername(username, (err, existingUser) => {
      if (err) {
        logger.error(`Error during registration: ${err.message}`);
        return res.status(500).send("Internal Server Error");
      }
      if (existingUser) {
        req.flash("error", "Username already exists");
        return res.redirect("/auth/register");
      } else {
        const hashedPassword = bcrypt.hashSync(password, 10);
        const newUser = {
          _id: uuidv4(),
          username,
          password: hashedPassword,
          email,
          role: "volunteer", // default role
        };
        usersDb.addUser(newUser, (err, user) => {
          if (err) {
            logger.error(`Error during registration: ${err.message}`);
            return res.status(500).send("Internal Server Error");
          }
          req.flash("success", "Registration successful, please login");
          return res.redirect("/auth/login");
        });
      }
    });
  } catch (error) {
    logger.error(`Error during registration: ${error.message}`);
    res.status(500).send("Internal Server Error");
  }
};

exports.logout = (req, res, logger) => {
  req.session.destroy((err) => {
    if (err) {
      logger.error(`Error during logout: ${err.message}`);
      res.status(500).send("Internal Server Error");
    } else {
      req.flash("success", "Successfully logged out");
      res.redirect("/");
    }
  });
};