const express = require("express");
const { check } = require("express-validator");
const router = express.Router();
const manageItemsController = require("../controllers/itemController");

module.exports = (upload, itemsDb, logger) => {
  router.get("/", (req, res) =>
    manageItemsController.getManageItems(req, res, itemsDb, logger),
  );

  router.post(
    "/api/add",
    upload.single("image"),
    [
      check("name")
        .isLength({ max: 30 })
        .withMessage("Item name cannot exceed 100 characters."),
      check("description")
        .isLength({ max: 100 })
        .withMessage("Description cannot exceed 500 characters."),
      check("price")
        .isFloat({ min: 1 })
        .withMessage("Price must be at least 1."),
    ],
    (req, res) => manageItemsController.postAddItem(req, res, itemsDb, logger),
  );

  router.post("/api/delete/:id", (req, res) =>
    manageItemsController.deleteItem(req, res, itemsDb, logger),
  );

  router.get("/edit/:id", (req, res) =>
    manageItemsController.getEditItem(req, res, itemsDb, logger),
  );

  router.post(
    "/api/edit/:id",
    upload.single("image"),
    [
      check("name")
        .isLength({ max: 30 })
        .withMessage("Item name cannot exceed 100 characters."),
      check("description")
        .isLength({ max: 100 })
        .withMessage("Description cannot exceed 500 characters."),
      check("price")
        .isFloat({ min: 1 })
        .withMessage("Price must be at least 1."),
    ],
    (req, res) => manageItemsController.postEditItem(req, res, itemsDb, logger),
  );

  return router;
};
