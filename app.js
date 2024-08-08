const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const NeDB = require('nedb');
const path = require('path');
const mustacheExpress = require('mustache-express');
const flash = require('connect-flash');
const methodOverride = require('method-override');
const multer = require('multer');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// Middleware setup
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({ secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: true }));
app.use(flash());
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride('_method'));

// Ensure the data directory exists
const fs = require('fs');
const dataDir = path.join(__dirname, process.env.DB_PATH);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir);
}

// Ensure the uploads directory exists
const uploadsDir = path.join(__dirname, 'public/uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Set up databases
const itemsDb = new NeDB({ filename: path.join(dataDir, 'items.db'), autoload: true });
const usersDb = new NeDB({ filename: path.join(dataDir, 'users.db'), autoload: true });

// View engine setup
app.engine('mustache', mustacheExpress());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'mustache');

// Middleware to make flash messages available in views
app.use((req, res, next) => {
  res.locals.messages = req.flash();
  res.locals.user = req.session.user;
  res.locals.manager = req.session.user && req.session.user.role === 'manager';
  next();
});

// Routes
app.use('/', require('./routes/index'));
app.use('/items', require('./routes/items'));
app.use('/users', require('./routes/users'));
app.use('/auth', require('./routes/auth'));
app.use('/dashboard', require('./routes/dashboard'));
app.use('/manage-items', require('./routes/manage-items')(upload)); // Pass upload middleware here
app.use('/manage-volunteers', require('./routes/manage-volunteers'));

// Home route
app.get('/', (req, res) => {
  res.redirect('/about');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});