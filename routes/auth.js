const express = require("express");
const { check } = require("express-validator");
const authController = require("../controllers/authController");
const rateLimit = require("express-rate-limit");
const router = express.Router();

module.exports = (usersDb, logger) => {
  // Rate limiter configuration: maximum of 5 requests per minute
  const loginLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 5, // limit each IP to 5 requests per windowMs
    message: "Too many login attempts from this IP, please try again after a minute"
  });

  // Route for displaying the login page
  router.get("/login", (req, res) =>
    authController.getLogin(req, res, usersDb, logger),
  );

  // Route for displaying the registration page
  router.get("/register", (req, res) =>
    authController.getRegister(req, res, usersDb, logger),
  );

  // Route for handling login form submission
  router.post(
    "/api/login",
    loginLimiter,
    [
      // Validation for username and password fields
      check("username").trim().notEmpty().withMessage("Username is required"),
      check("password").trim().notEmpty().withMessage("Password is required"),
    ],
    (req, res) => authController.postLogin(req, res, usersDb, logger),
  );

  // Route for handling registration form submission
  router.post(
    "/api/register",
    [
      // Validation for username, email, password, and confirmPassword fields
      check("username")
        .trim()
        .isLength({ min: 3 })
        .withMessage("Username must be at least 3 characters long."),
      check("email").isEmail().withMessage("Invalid email format."),
      check("password")
        .trim()
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters long."),
      check("confirmPassword").custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error("Passwords do not match.");
        }
        return true;
      }),
    ],
    (req, res) => authController.postRegister(req, res, usersDb, logger),
  );

  // Route for handling logout
  router.get("/logout", (req, res) => authController.logout(req, res, logger));

  return router;
};
