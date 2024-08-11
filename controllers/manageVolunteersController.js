const { check, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const saltRounds = 10;

exports.getManageVolunteers = (req, res, usersDb, logger) => {
  if (!req.session.user || req.session.user.role !== "manager") {
    logger.warn("Unauthorized access to manage volunteers");
    req.flash("error", "Unauthorized access");
    return res.redirect("/dashboard");
  }

  usersDb.getAllUsers((err, volunteers) => {
    if (err) {
      logger.error("Error loading volunteers:", err);
      req.flash("error", "Failed to load volunteers. Please try again.");
      return res.redirect("/dashboard");
    }
    logger.info("Displayed manage volunteers page", { volunteers });
    return res.render("manage-volunteers", {
      title: "Manage Volunteers",
      volunteers,
    });
  });
};

exports.postAddVolunteer = [
  check("username")
    .isLength({ min: 3 })
    .withMessage("Username must be at least 3 characters long."),
  check("email").isEmail().withMessage("Invalid email format."),
  check("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long."),
  check("confirmPassword").custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("Passwords do not match.");
    }
    return true;
  }),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      req.flash(
        "error",
        errors
          .array()
          .map((error) => error.msg)
          .join(". "),
      );
      return res.redirect("/manage-volunteers");
    }
    next();
  },
  (req, res, usersDb, logger) => {
    const newUser = {
      username: req.body.username,
      password: bcrypt.hashSync(req.body.password, saltRounds),
      email: req.body.email,
      role: "volunteer",
    };

    usersDb.addUser(newUser, (err, newDoc) => {
      if (err) {
        req.flash("error", "Failed to add volunteer. Please try again.");
        logger.error("Failed to add volunteer:", err);
        return res.redirect("/manage-volunteers");
      }
      req.flash("success", "Volunteer added successfully");
      logger.info("Volunteer added successfully:", { newDoc });
      return res.redirect("/manage-volunteers");
    });
  },
];

exports.getEditVolunteer = (req, res, usersDb, logger) => {
  if (!req.session.user || req.session.user.role !== "manager") {
    logger.warn("Unauthorized access to edit volunteer");
    req.flash("error", "Unauthorized access");
    return res.redirect("/dashboard");
  }

  const volunteerId = req.params.id;
  usersDb.findUserById(volunteerId, (err, volunteer) => {
    if (err || !volunteer) {
      logger.error("Failed to load volunteer for editing:", {
        volunteerId,
        err,
      });
      req.flash("error", "Failed to load volunteer. Please try again.");
      return res.redirect("/manage-volunteers");
    }
    logger.info("Displayed edit volunteer page for volunteer:", { volunteer });
    return res.render("edit-volunteer", {
      title: "Edit Volunteer",
      volunteer,
    });
  });
};

exports.postEditVolunteer = (req, res, usersDb, logger) => {
  if (!req.session.user || req.session.user.role !== "manager") {
    logger.warn("Unauthorized edit attempt");
    req.flash("error", "Unauthorized access");
    return res.redirect("/dashboard");
  }

  const volunteerId = req.params.id;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    req.flash(
      "error",
      errors
        .array()
        .map((error) => error.msg)
        .join(". "),
    );
    logger.warn("Validation errors on edit volunteer:", {
      errors: errors.array(),
    });
    return res.redirect(`/manage-volunteers/edit/${volunteerId}`);
  }

  const updatedVolunteer = {
    username: req.body.username,
    email: req.body.email,
  };

  if (req.body.password) {
    const hashedPassword = bcrypt.hashSync(req.body.password, 10);
    updatedVolunteer.password = hashedPassword;
  }

  usersDb.updateUser(volunteerId, updatedVolunteer, (err, numReplaced) => {
    if (err || numReplaced === 0) {
      logger.error("Failed to update volunteer:", { volunteerId, err });
      req.flash("error", "Failed to update volunteer. Please try again.");
      return res.redirect(`/manage-volunteers/edit/${volunteerId}`);
    }
    req.flash("success", "Volunteer updated successfully");
    logger.info("Volunteer updated successfully:", {
      volunteerId,
      updatedVolunteer,
    });
    return res.redirect("/manage-volunteers");
  });
};

exports.deleteVolunteer = (req, res, usersDb, logger) => {
  if (!req.session.user) {
    req.flash("error", "Unauthorized access");
    logger.warn("Unauthorized delete attempt");
    return res.redirect("/auth/login");
  }

  const volunteerId = req.params.id;
  logger.info("Deleting volunteer", { volunteerId });

  usersDb.deleteUser(volunteerId, (err, numRemoved) => {
    if (err || numRemoved === 0) {
      req.flash("error", "Failed to delete volunteer. Please try again.");
      logger.error("Failed to delete volunteer:", { volunteerId, err });
      return res.redirect("/manage-volunteers");
    }
    req.flash("success", "Volunteer deleted successfully");
    logger.info("Volunteer deleted successfully:", { volunteerId });
    return res.redirect("/manage-volunteers");
  });
};
