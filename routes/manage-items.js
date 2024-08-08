const express = require('express');
const { check } = require('express-validator');
const router = express.Router();
const itemController = require('../controllers/itemController');

module.exports = (upload, itemsDb, logger) => {
  router.get('/', (req, res) => itemController.getManageItems(req, res, itemsDb, logger));

  router.post('/api', upload.single('image'), [
    check('name').trim().notEmpty().withMessage('Name is required').escape(),
    check('description').trim().notEmpty().withMessage('Description is required').escape(),
    check('price').isNumeric().withMessage('Price must be a number'),
    check('store').trim().notEmpty().withMessage('Store is required').escape()
  ], (req, res) => itemController.postAddItem(req, res, itemsDb, logger));

  router.delete('/api/:id', (req, res) => itemController.deleteItem(req, res, itemsDb, logger));

  router.get('/edit/:id', (req, res) => itemController.getEditItem(req, res, itemsDb, logger));

  router.post('/api/edit/:id', upload.single('image'), [
    check('name').trim().notEmpty().withMessage('Name is required').escape(),
    check('description').trim().notEmpty().withMessage('Description is required').escape(),
    check('price').isNumeric().withMessage('Price must be a number'),
    check('store').trim().notEmpty().withMessage('Store is required').escape()
  ], (req, res) => itemController.postEditItem(req, res, itemsDb, logger));

  return router;
};