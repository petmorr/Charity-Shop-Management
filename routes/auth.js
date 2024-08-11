const express = require("express");
const { check } = require("express-validator");
const router = express.Router();
const authController = require("../controllers/authController");

module.exports = (usersDb, logger) => {
  router.get("/login", (req, res) =>
    authController.getLogin(req, res, usersDb, logger),
  );

  router.get("/register", (req, res) =>
    authController.getRegister(req, res, usersDb, logger),
  );

  router.post(
    "/api/login",
    [
      check("username").trim().notEmpty().withMessage("Username is required"),
      check("password").trim().notEmpty().withMessage("Password is required"),
    ],
    (req, res) => authController.postLogin(req, res, usersDb, logger),
  );

  router.post(
    "/api/register",
    [
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

  router.get("/logout", (req, res) => authController.logout(req, res, logger));

  return router;
};
