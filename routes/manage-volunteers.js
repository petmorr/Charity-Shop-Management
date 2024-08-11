const express = require("express");
const { check } = require("express-validator");
const manageVolunteersController = require("../controllers/manageVolunteersController");

const router = express.Router();

module.exports = (usersDb, logger) => {
  // Route for getting the manage volunteers page
  router.get("/", (req, res) =>
    manageVolunteersController.getManageVolunteers(req, res, usersDb, logger),
  );

  // Route for adding a new volunteer
  router.post(
    "/api/add",
    [
      // Validation for username field
      check("username")
        .trim()
        .notEmpty()
        .withMessage("Username is required")
        .escape(),
      // Validation for password field
      check("password")
        .trim()
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters long")
        .escape(),
      // Validation for email field
      check("email")
        .isEmail()
        .withMessage("Invalid email address")
        .normalizeEmail(),
    ],
    (req, res) =>
      manageVolunteersController.postAddVolunteer(req, res, usersDb, logger),
  );

  // Route for deleting a volunteer
  router.post("/api/delete/:id", (req, res) =>
    manageVolunteersController.deleteVolunteer(req, res, usersDb, logger),
  );

  // Route for getting the edit volunteer page
  router.get("/edit/:id", (req, res) =>
    manageVolunteersController.getEditVolunteer(req, res, usersDb, logger),
  );

  // Route for editing a volunteer
  router.post(
    "/api/edit/:id",
    [
      // Validation for username field
      check("username")
        .trim()
        .notEmpty()
        .withMessage("Username is required")
        .escape(),
      // Validation for email field
      check("email")
        .isEmail()
        .withMessage("Invalid email address")
        .normalizeEmail(),
      // Validation for password field (optional)
      check("password")
        .optional()
        .trim()
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters long")
        .escape(),
    ],
    (req, res) =>
      manageVolunteersController.postEditVolunteer(req, res, usersDb, logger),
  );

  return router;
};
