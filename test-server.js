const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const NeDB = require('nedb');
const path = require('path');
const mustacheExpress = require('mustache-express');
const flash = require('connect-flash');
const methodOverride = require('method-override');
const multer = require('multer');
const fs = require('fs');
const winston = require('winston');
require('dotenv').config();

// Ensure proper module resolution
const itemsDb = new NeDB({ inMemoryOnly: true });
const usersDb = new NeDB({ inMemoryOnly: true });

// Winston logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message }) => `${timestamp} ${level}: ${message}`)
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' })
  ]
});

const app = express();
const PORT = process.env.PORT || 3000;

// Mustache setup
app.engine('mustache', mustacheExpress());
app.set('view engine', 'mustache');
app.set('views', path.join(__dirname, '../views'));

// Middleware setup
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(session({ secret: process.env.SESSION_SECRET || 'secret', resave: false, saveUninitialized: true }));
app.use(flash());
app.use(express.static(path.join(__dirname, 'public')));

// Using the exact same routes as in app.js with absolute paths
app.use('/', require(path.join(__dirname, './routes/index'))(itemsDb, logger));
app.use('/auth', require(path.join(__dirname, './routes/auth'))(usersDb, logger));
app.use('/dashboard', require(path.join(__dirname, './routes/dashboard'))(logger));
app.use('/manage-items', require(path.join(__dirname, './routes/manage-items'))(multer(), itemsDb, logger));
app.use('/manage-volunteers', require(path.join(__dirname, './routes/manage-volunteers'))(usersDb, logger));

// Export the app for testing
module.exports = app