const { validationResult } = require("express-validator");

exports.getManageItems = (req, res, itemsDb, logger) => {
  if (!req.session.user) {
    logger.warn("Unauthorized access to manage items");
    req.flash("error", "Unauthorized access");
    return res.redirect("/auth/login");
  }

  const query =
    req.session.user.role === "manager"
      ? {}
      : { owner: req.session.user.username };

  itemsDb.find(query, (err, items) => {
    if (err) {
      req.flash("error", "Failed to load items. Please try again.");
      logger.error("Error loading items:", err);
      return res.redirect("/dashboard");
    }
    logger.info("Displayed manage items page");
    return res.render("manage-items", { title: "Manage Items", items });
  });
};

exports.postAddItem = (req, res, itemsDb, logger) => {
  if (!req.session.user) {
    req.flash("error", "Unauthorized access");
    logger.warn("Unauthorized add attempt");
    return res.redirect("/auth/login");
  }

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    req.flash(
      "error",
      errors
        .array()
        .map((error) => error.msg)
        .join(". "),
    );
    logger.warn("Validation errors on add item:", { errors: errors.array() });
    return res.redirect("/manage-items");
  }

  const newItem = {
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
    store: req.body.store,
    image: req.file ? `/uploads/${req.file.filename}` : "",
    owner: req.session.user.username,
  };

  itemsDb.insert(newItem, (err, newDoc) => {
    if (err) {
      req.flash("error", "Failed to add item. Please try again.");
      logger.error("Failed to add item:", err);
      return res.redirect("/manage-items");
    }
    req.flash("success", "Item added successfully");
    logger.info("Item added successfully:", { newDoc });
    return res.redirect("/manage-items");
  });
};

exports.deleteItem = (req, res, itemsDb, logger) => {
  if (!req.session.user) {
    req.flash("error", "Unauthorized access");
    logger.warn("Unauthorized delete attempt");
    return res.redirect("/auth/login");
  }

  const itemId = req.params.id;
  const query =
    req.session.user.role === "manager"
      ? { _id: itemId }
      : { _id: itemId, owner: req.session.user.username };

  itemsDb.remove(query, {}, (err, numRemoved) => {
    if (err || numRemoved === 0) {
      req.flash("error", "Failed to delete item. Please try again.");
      logger.error("Failed to delete item:", { itemId, err });
      return res.redirect("/manage-items");
    }
    req.flash("success", "Item deleted successfully");
    logger.info("Item deleted successfully:", { itemId });
    return res.redirect("/manage-items");
  });
};

exports.getEditItem = (req, res, itemsDb, logger) => {
  if (!req.session.user) {
    req.flash("error", "Unauthorized access");
    logger.warn("Unauthorized edit attempt");
    return res.redirect("/auth/login");
  }

  const itemId = req.params.id;
  const query =
    req.session.user.role === "manager"
      ? { _id: itemId }
      : { _id: itemId, owner: req.session.user.username };

  itemsDb.findOne(query, (err, item) => {
    if (err || !item) {
      req.flash("error", "Failed to load item. Please try again.");
      logger.error("Error loading item:", { itemId, err });
      return res.redirect("/manage-items");
    }
    logger.info("Displayed edit item page for item:", { item });
    return res.render("edit-item", { title: "Edit Item", item });
  });
};

exports.postEditItem = (req, res, itemsDb, logger) => {
  if (!req.session.user) {
    req.flash("error", "Unauthorized access");
    logger.warn("Unauthorized edit attempt");
    return res.redirect("/auth/login");
  }

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    req.flash(
      "error",
      errors
        .array()
        .map((error) => error.msg)
        .join(". "),
    );
    logger.warn("Validation errors on edit item:", { errors: errors.array() });
    return res.redirect(`/manage-items/edit/${req.params.id}`);
  }

  const itemId = req.params.id;
  const updatedItem = {
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
    store: req.body.store,
    image: req.file ? `/uploads/${req.file.filename}` : req.body.existingImage,
  };

  const query =
    req.session.user.role === "manager"
      ? { _id: itemId }
      : { _id: itemId, owner: req.session.user.username };

  itemsDb.update(query, { $set: updatedItem }, {}, (err, numReplaced) => {
    if (err || numReplaced === 0) {
      req.flash("error", "Failed to update item. Please try again.");
      logger.error("Failed to update item:", { itemId, err });
      return res.redirect(`/manage-items/edit/${itemId}`);
    }
    req.flash("success", "Item updated successfully");
    logger.info("Item updated successfully:", { itemId, updatedItem });
    return res.redirect("/manage-items");
  });
};
