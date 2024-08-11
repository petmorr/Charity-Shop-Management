const express = require("express");
const { check } = require("express-validator");
const router = express.Router();
const authController = require("../controllers/authController");

module.exports = (usersDb, logger) => {
  router.get("/login", (req, res) => authController.getLogin(req, res));

  router.post(
    "/api/login",
    [
      check("username")
        .trim()
        .notEmpty()
        .withMessage("Username is required")
        .escape(),
      check("password")
        .trim()
        .notEmpty()
        .withMessage("Password is required")
        .escape(),
    ],
    (req, res) => authController.postLogin(req, res, usersDb, logger),
  );

  router.get("/register", (req, res) => authController.getRegister(req, res));

  router.post(
    "/api/register",
    [
      check("username")
        .trim()
        .notEmpty()
        .withMessage("Username is required")
        .escape(),
      check("password")
        .trim()
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters long")
        .escape(),
      check("email")
        .isEmail()
        .withMessage("Invalid email address")
        .normalizeEmail(),
    ],
    (req, res) => authController.postRegister(req, res, usersDb, logger),
  );

  router.get("/logout", (req, res) => authController.logout(req, res, logger));

  return router;
};
