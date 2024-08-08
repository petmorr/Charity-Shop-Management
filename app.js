const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const NeDB = require('nedb');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware setup
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({ secret: 'secret-key', resave: false, saveUninitialized: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Set up databases
const itemsDb = new NeDB({ filename: 'data/items.db', autoload: true });
const usersDb = new NeDB({ filename: 'data/users.db', autoload: true });

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'mustache');
app.engine('mustache', require('hogan-middleware').__express);

// Routes
app.use('/', require('./routes/index'));
app.use('/items', require('./routes/items'));
app.use('/users', require('./routes/users'));
app.use('/auth', require('./routes/auth'));

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});