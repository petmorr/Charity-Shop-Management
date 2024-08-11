const { check, validationResult } = require("express-validator");

// Controller function to handle GET request for managing items
exports.getManageItems = (req, res, itemsDb, logger) => {
  if (!req.session.user) {
    logger.warn("Unauthorized access to manage items");
    req.flash("error", "Unauthorized access");
    return res.redirect("/auth/login");
  }

  // Determine the query based on the user's role
  const query =
    req.session.user.role === "manager"
      ? {}
      : { owner: req.session.user.username };

  // Retrieve all items from the database
  itemsDb.getAllItems((err, items) => {
    if (err) {
      req.flash("error", "Failed to load items. Please try again.");
      logger.error("Error loading items:", err);
      return res.redirect("/dashboard");
    }
    logger.info("Displayed manage items page");
    return res.render("manage-items", { title: "Manage Items", items });
  });
};

// Controller function to handle POST request for adding an item
exports.postAddItem = (req, res, itemsDb, logger) => {
  const errors = validationResult(req);
  if (!req.session.user) {
    req.flash("error", "Unauthorized access");
    logger.warn("Unauthorized add attempt");
    return res.redirect("/auth/login");
  }

  // Check for validation errors
  if (!errors.isEmpty()) {
    req.flash(
      "error",
      errors
        .array()
        .map((error) => error.msg)
        .join(". "),
    );
    return res.redirect("/manage-items");
  }

  // Create a new item object with the provided data
  const newItem = {
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
    store: req.body.store,
    image: req.file ? `/uploads/${req.file.filename}` : "",
    owner: req.session.user.username,
  };

  // Add the new item to the database
  itemsDb.addItem(newItem, (err, newDoc) => {
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

// Controller function to handle DELETE request for deleting an item
exports.deleteItem = (req, res, itemsDb, logger) => {
  if (!req.session.user) {
    req.flash("error", "Unauthorized access");
    logger.warn("Unauthorized delete attempt");
    return res.redirect("/auth/login");
  }

  // Get the item ID from the request parameters
  const itemId = req.params.id;

  // Determine the query based on the user's role
  const query =
    req.session.user.role === "manager"
      ? { _id: itemId }
      : { _id: itemId, owner: req.session.user.username };

  // Delete the item from the database
  itemsDb.deleteItem(itemId, (err, numRemoved) => {
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

// Controller function to handle GET request for editing an item
exports.getEditItem = (req, res, itemsDb, logger) => {
  if (!req.session.user) {
    req.flash("error", "Unauthorized access");
    logger.warn("Unauthorized edit attempt");
    return res.redirect("/auth/login");
  }

  // Get the item ID from the request parameters
  const itemId = req.params.id;

  // Determine the query based on the user's role
  const query =
    req.session.user.role === "manager"
      ? { _id: itemId }
      : { _id: itemId, owner: req.session.user.username };

  // Find the item in the database by its ID
  itemsDb.findItemById(itemId, (err, item) => {
    if (err || !item) {
      req.flash("error", "Failed to load item. Please try again.");
      logger.error("Error loading item:", { itemId, err });
      return res.redirect("/manage-items");
    }
    logger.info("Displayed edit item page for item:", { item });
    return res.render("edit-item", { title: "Edit Item", item });
  });
};

// Controller function to handle POST request for updating an item
exports.postEditItem = (req, res, itemsDb, logger) => {
  if (!req.session.user) {
    req.flash("error", "Unauthorized access.");
    logger.warn("Unauthorized edit attempt by user:", {
      user: req.session.user,
    });
    return res.redirect("/dashboard");
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
    return res.redirect("/manage-items");
  }

  // Get the item ID from the request parameters
  const itemId = req.params.id;

  // Create an updated item object with the provided data
  const updatedItem = {
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
    store: req.body.store,
    image: req.file ? `/uploads/${req.file.filename}` : req.body.existingImage,
  };

  // Determine the query based on the user's role
  const query =
    req.session.user.role === "manager"
      ? { _id: itemId }
      : { _id: itemId, owner: req.session.user.username };

  // Update the item in the database
  itemsDb.updateItem(itemId, updatedItem, (err, numReplaced) => {
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
