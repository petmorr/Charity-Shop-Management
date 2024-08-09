const express = require('express');
const { check } = require('express-validator');
const router = express.Router();
const manageVolunteersController = require('../controllers/manageVolunteersController');

module.exports = (usersDb, logger) => {
  router.get('/', (req, res) => manageVolunteersController.getManageVolunteers(req, res, usersDb, logger));
  
  router.post('/add', [
    check('username').trim().notEmpty().withMessage('Username is required').escape(),
    check('password').trim().isLength({ min: 6 }).withMessage('Password must be at least 6 characters long').escape(),
    check('email').isEmail().withMessage('Invalid email address').normalizeEmail()
  ], (req, res) => manageVolunteersController.postAddVolunteer(req, res, usersDb, logger));
  
  router.post('/delete/:id', (req, res) => manageVolunteersController.deleteVolunteer(req, res, usersDb, logger));
  
  return router;
};