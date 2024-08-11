const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const NeDB = require("nedb");
const path = require("path");
const mustacheExpress = require("mustache-express");
const flash = require("connect-flash");
const methodOverride = require("method-override");
const multer = require("multer");
const fs = require("fs");
const winston = require("winston");
const setupManagerUser = require("./setupManagerUser");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

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
    new winston.transports.Console(),
    new winston.transports.File({ filename: "logs/error.log", level: "error" }),
    new winston.transports.File({ filename: "logs/combined.log" }),
  ],
});

// Ensure the data directory exists
const dataDir = path.join(__dirname, "data");
if (!fs.existsSync(dataDir)) {
  logger.info("Creating data directory");
  fs.mkdirSync(dataDir, { recursive: true });
}
logger.info(`Data directory: ${dataDir} ${fs.existsSync(dataDir)}`);

// Ensure the uploads directory exists
const uploadsDir = path.join(__dirname, "public/uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
logger.info(`Uploads directory: ${uploadsDir} ${fs.existsSync(uploadsDir)}`);

// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });

// Middleware setup
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  }),
);
app.use(flash());
app.use(express.static(path.join(__dirname, "public")));

// Initialize databases with error handling
const itemsDb = require("./models/item");
const usersDb = require("./models/user");

itemsDb.loadDatabase((err) => {
  if (err) {
    logger.error("Error loading items database:", err);
    process.exit(1);
  }
  logger.info("Items database loaded successfully.");
});

usersDb.loadDatabase((err) => {
  if (err) {
    logger.error("Error loading users database:", err);
    process.exit(1);
  }
  logger.info("Users database loaded successfully.");
});

// View engine setup
app.engine("mustache", mustacheExpress());
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "mustache");

// Middleware to make flash messages available in views
app.use((req, res, next) => {
  res.locals.messages = req.flash();
  res.locals.user = req.session.user;
  res.locals.manager = req.session.user && req.session.user.role === "manager";
  next();
});

// Routes
app.use("/", require("./routes/index")(itemsDb, logger));
app.use("/auth", require("./routes/auth")(usersDb, logger));
app.use("/dashboard", require("./routes/dashboard")(logger));
app.use(
  "/manage-items",
  require("./routes/manage-items")(upload, itemsDb, logger),
);
app.use(
  "/manage-volunteers",
  require("./routes/manage-volunteers")(usersDb, logger),
);

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error(err.stack);
  if (!res.headersSent) {
    res.status(500).send("Something broke!");
  }
});

// Setup the manager user
setupManagerUser(logger);

// Start the server
app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
});
