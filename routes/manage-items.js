const express = require("express");
const { check } = require("express-validator");
const manageItemsController = require("../controllers/itemController");

const router = express.Router();

module.exports = (upload, itemsDb, logger) => {
  // Route to get all items
  router.get("/", (req, res) =>
    manageItemsController.getManageItems(req, res, itemsDb, logger),
  );

  // Route to add a new item
  router.post(
    "/api/add",
    upload.single("image"),
    [
      // Validation for item name
      check("name")
        .isLength({ max: 30 })
        .withMessage("Item name cannot exceed 100 characters."),
      // Validation for item description
      check("description")
        .isLength({ max: 100 })
        .withMessage("Description cannot exceed 500 characters."),
      // Validation for item price
      check("price")
        .isFloat({ min: 1 })
        .withMessage("Price must be at least 1."),
    ],
    (req, res) => manageItemsController.postAddItem(req, res, itemsDb, logger),
  );

  // Route to delete an item
  router.post("/api/delete/:id", (req, res) =>
    manageItemsController.deleteItem(req, res, itemsDb, logger),
  );

  // Route to get edit item page
  router.get("/edit/:id", (req, res) =>
    manageItemsController.getEditItem(req, res, itemsDb, logger),
  );

  // Route to edit an item
  router.post(
    "/api/edit/:id",
    upload.single("image"),
    [
      // Validation for item name
      check("name")
        .isLength({ max: 30 })
        .withMessage("Item name cannot exceed 100 characters."),
      // Validation for item description
      check("description")
        .isLength({ max: 100 })
        .withMessage("Description cannot exceed 500 characters."),
      // Validation for item price
      check("price")
        .isFloat({ min: 1 })
        .withMessage("Price must be at least 1."),
    ],
    (req, res) => manageItemsController.postEditItem(req, res, itemsDb, logger),
  );

  return router;
};
