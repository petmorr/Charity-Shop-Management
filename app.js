const express = require("express"); // Importing the express module
const bodyParser = require("body-parser"); // Importing the body-parser module
const session = require("express-session"); // Importing the express-session module
const NeDB = require("nedb"); // Importing the NeDB module
const path = require("path"); // Importing the path module
const mustacheExpress = require("mustache-express"); // Importing the mustache-express module
const flash = require("connect-flash"); // Importing the connect-flash module
const methodOverride = require("method-override"); // Importing the method-override module
const multer = require("multer"); // Importing the multer module
const fs = require("fs"); // Importing the fs module
const winston = require("winston"); // Importing the winston module
const setupManagerUser = require("./setupManagerUser"); // Importing the setupManagerUser module
const itemsDb = require("./models/item"); // Importing the items database module
const usersDb = require("./models/user"); // Importing the users database module
const bcrypt = require("bcrypt"); // Importing the bcrypt module

require("dotenv").config(); // Loading environment variables

const app = express(); // Creating an instance of the express application
const PORT = process.env.PORT || 3000; // Setting the port number

// Configure winston
const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(
      ({ timestamp, level, message }) => `${timestamp} ${level}: ${message}`,
    ),
  ),
  transports: [
    new winston.transports.Console(), // Logging to the console
    new winston.transports.File({ filename: "logs/error.log", level: "error" }), // Logging errors to a file
    new winston.transports.File({ filename: "logs/combined.log" }), // Logging all messages to a file
  ],
});

// Ensure the data directory exists
const dataDir = path.join(__dirname, "data"); // Creating the path to the data directory
if (!fs.existsSync(dataDir)) {
  logger.info("Creating data directory"); // Logging a message
  fs.mkdirSync(dataDir, { recursive: true }); // Creating the data directory
}
logger.info(`Data directory: ${dataDir} ${fs.existsSync(dataDir)}`); // Logging the data directory path and its existence

// Ensure the uploads directory exists
const uploadsDir = path.join(__dirname, "public/uploads"); // Creating the path to the uploads directory
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true }); // Creating the uploads directory
}
logger.info(`Uploads directory: ${uploadsDir} ${fs.existsSync(uploadsDir)}`); // Logging the uploads directory path and its existence

// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads/"); // Setting the destination directory for uploaded files
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname); // Setting the filename for uploaded files
  },
});
const upload = multer({ storage });

// Middleware setup
app.use(bodyParser.json()); // Parsing JSON bodies
app.use(bodyParser.urlencoded({ extended: true })); // Parsing URL-encoded bodies
app.use(methodOverride("_method")); // Allowing HTTP methods override
app.use(
  session({
    secret: process.env.SESSION_SECRET, // Setting the session secret
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  }),
);
app.use(flash()); // Using flash messages
app.use(express.static(path.join(__dirname, "public"))); // Serving static files from the "public" directory

// Initialize databases with error handling

itemsDb.loadDatabase((err) => {
  if (err) {
    logger.error("Error loading items database:", err); // Logging an error message
    process.exit(1); // Exiting the process with an error code
  }
  logger.info("Items database loaded successfully."); // Logging a success message
});

usersDb.loadDatabase((err) => {
  if (err) {
    logger.error("Error loading users database:", err); // Logging an error message
    process.exit(1); // Exiting the process with an error code
  }
  logger.info("Users database loaded successfully."); // Logging a success message
});

// View engine setup
app.engine("mustache", mustacheExpress()); // Setting the mustache template engine
app.set("views", path.join(__dirname, "views")); // Setting the views directory
app.set("view engine", "mustache"); // Setting the default view engine to mustache

// Middleware to make flash messages available in views
app.use((req, res, next) => {
  res.locals.messages = req.flash(); // Making flash messages available in views
  res.locals.user = req.session.user; // Making the user object available in views
  res.locals.manager = req.session.user && req.session.user.role === "manager"; // Checking if the user is a manager
  next();
});

// Routes
app.use("/", require("./routes/index")(itemsDb, logger)); // Mounting the index route
app.use("/auth", require("./routes/auth")(usersDb, logger)); // Mounting the auth route
app.use("/dashboard", require("./routes/dashboard")(logger)); // Mounting the dashboard route
app.use(
  "/manage-items",
  require("./routes/manage-items")(upload, itemsDb, logger), // Mounting the manage-items route
);
app.use(
  "/manage-volunteers",
  require("./routes/manage-volunteers")(usersDb, logger), // Mounting the manage-volunteers route
);

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error(err.stack); // Logging the error stack trace
  if (!res.headersSent) {
    res.status(500).send("Something broke!"); // Sending a generic error message
  }
});

// Setup the manager user
setupManagerUser(logger); // Setting up the manager user

// Start the server
app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`); // Logging a message
});
