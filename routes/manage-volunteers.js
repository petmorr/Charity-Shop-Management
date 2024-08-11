const express = require("express");
const { check } = require("express-validator");
const router = express.Router();
const manageVolunteersController = require("../controllers/manageVolunteersController");

module.exports = (usersDb, logger) => {
  // Route to get the manage volunteers page
  router.get("/", (req, res) =>
    manageVolunteersController.getManageVolunteers(req, res, usersDb, logger),
  );

  // Route to add a new volunteer
  router.post(
    "/api/add",
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
      check("confirmPassword")
        .trim()
        .custom((value, { req }) => {
          if (value !== req.body.password) {
            throw new Error("Passwords do not match");
          }
          return true;
        })
        .escape(),
      check("email")
        .isEmail()
        .withMessage("Invalid email address")
        .normalizeEmail(),
    ],
    (req, res) =>
      manageVolunteersController.postAddVolunteer(req, res, usersDb, logger),
  );

  // Route to delete a volunteer
  router.post("/api/delete/:id", (req, res) =>
    manageVolunteersController.deleteVolunteer(req, res, usersDb, logger),
  );

  // Route to get the edit volunteer form
  router.get("/edit/:id", (req, res) =>
    manageVolunteersController.getEditVolunteer(req, res, usersDb, logger),
  );

  // Route to handle the form submission for editing a volunteer
  router.post(
    "/edit/:id",
    [
      check("username")
        .trim()
        .notEmpty()
        .withMessage("Username is required")
        .escape(),
      check("password")
        .optional()
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters long")
        .escape(),
      check("confirmPassword")
        .optional()
        .custom((value, { req }) => {
          if (value && value !== req.body.password) {
            throw new Error("Passwords do not match");
          }
          return true;
        })
        .escape(),
      check("email")
        .isEmail()
        .withMessage("Invalid email address")
        .normalizeEmail(),
    ],
    (req, res) =>
      manageVolunteersController.postEditVolunteer(req, res, usersDb, logger),
  );

  return router;
};