const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const saltRounds = 10;

exports.getManageVolunteers = (req, res, usersDb, logger) => {
  if (!req.session.user || req.session.user.role !== "manager") {
    logger.warn("Unauthorized access to manage volunteers");
    req.flash("error", "Unauthorized access");
    return res.redirect("/dashboard");
  }

  usersDb.find({ role: "volunteer" }, (err, volunteers) => {
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

exports.postAddVolunteer = (req, res, usersDb, logger) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    req.flash(
      "error",
      errors
        .array()
        .map((error) => error.msg)
        .join(". "),
    );
    logger.warn("Validation errors on add volunteer:", {
      errors: errors.array(),
    });
    return res.redirect("/manage-volunteers");
  }

  const newUser = {
    username: req.body.username,
    password: req.body.password,
    email: req.body.email,
    role: "volunteer",
  };

  usersDb.findOne({ username: newUser.username }, (err, user) => {
    if (err) {
      logger.error("Failed to add volunteer:", err);
      req.flash("error", "Failed to add volunteer. Please try again.");
      return res.redirect("/manage-volunteers");
    }

    if (user) {
      req.flash("error", "Username already exists");
      logger.warn("Attempt to add duplicate username:", {
        username: newUser.username,
      });
      return res.redirect("/manage-volunteers");
    }

    bcrypt.hash(newUser.password, saltRounds, (err, hash) => {
      if (err) {
        logger.error("Failed to hash password:", err);
        req.flash("error", "Failed to add volunteer. Please try again.");
        return res.redirect("/manage-volunteers");
      }

      newUser.password = hash;

      usersDb.insert(newUser, (err, newDoc) => {
        if (err) {
          logger.error("Failed to add volunteer:", err);
          req.flash("error", "Failed to add volunteer. Please try again.");
          return res.redirect("/manage-volunteers");
        }
        req.flash("success", "Volunteer added successfully");
        logger.info("Volunteer added successfully:", { newDoc });
        return res.redirect("/manage-volunteers");
      });
    });
  });
};

exports.deleteVolunteer = (req, res, usersDb, logger) => {
  const volunteerId = req.params.id;
  logger.info("Deleting volunteer", { volunteerId });

  usersDb.remove(
    { _id: volunteerId, role: "volunteer" },
    {},
    (err, numRemoved) => {
      if (err || numRemoved === 0) {
        req.flash("error", "Failed to delete volunteer. Please try again.");
        logger.error("Failed to delete volunteer:", { volunteerId, err });
        return res.redirect("/manage-volunteers");
      }
      req.flash("success", "Volunteer deleted successfully");
      logger.info("Volunteer deleted successfully:", { volunteerId });
      return res.redirect("/manage-volunteers");
    },
  );
};
