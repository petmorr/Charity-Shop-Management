const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");
const { validationResult } = require("express-validator");

// Render the login page
exports.getLogin = (req, res) => {
  res.render("login", { title: "Login" });
};

// Render the registration page
exports.getRegister = (req, res) => {
  res.render("register", { title: "Register" });
};

// Handle login form submission
exports.postLogin = async (req, res, usersDb, logger) => {
  const { username, password } = req.body;
  try {
    // Find user by username
    usersDb.findUserByUsername(username, (err, user) => {
      if (err) {
        logger.error(`Error during login: ${err.message}`);
        return res.status(500).send("Internal Server Error");
      }
      // Check if user exists and password matches
      if (user && bcrypt.compareSync(password, user.password)) {
        // Store user data in session
        req.session.userId = user._id;
        req.session.user = user;
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

// Handle registration form submission
exports.postRegister = async (req, res, usersDb, logger) => {
  const { username, password, email } = req.body;
  const errors = validationResult(req);
  // Check for validation errors
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
    // Check if username already exists
    usersDb.findUserByUsername(username, (err, existingUser) => {
      if (err) {
        logger.error(`Error during registration: ${err.message}`);
        return res.status(500).send("Internal Server Error");
      }
      if (existingUser) {
        req.flash("error", "Username already exists");
        return res.redirect("/auth/register");
      } else {
        // Hash the password and create new user
        const hashedPassword = bcrypt.hashSync(password, 10);
        const newUser = {
          _id: uuidv4(),
          username,
          password: hashedPassword,
          email,
          role: "volunteer", // default role
        };
        // Add new user to the database
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

// Handle user logout
exports.logout = (req, res, logger) => {
  if (req.session) {
    // Destroy the session
    req.session.destroy((err) => {
      if (err) {
        logger.error("Failed to destroy session:", err);
        return res.redirect("/dashboard");
      } else {
        res.redirect("/auth/login");
      }
    });
  } else {
    res.redirect("/auth/login");
  }
};