// Controller for handling the index route
exports.getIndex = (req, res, logger) => {
  try {
    // Render the index page with the title "Landing Page"
    res.render("index", { title: "Landing Page" });
    // Log the access to the landing page
    logger.info("Accessed Landing page");
  } catch (error) {
    // Log any error that occurs during rendering
    logger.error("Error rendering Landing page:", error);
    // If headers are not already sent, send a 500 status with an error message
    if (!res.headersSent) {
      res
        .status(500)
        .send("An error occurred while rendering the Landing page.");
    }
  }
};

// Controller for handling the about route
exports.getAbout = (req, res, logger) => {
  try {
    // Render the about page with the title "About Us"
    res.render("about", { title: "About Us" });
    // Log the access to the about page
    logger.info("Accessed About Us page");
  } catch (error) {
    // Log any error that occurs during rendering
    logger.error("Error rendering About Us page:", error);
    // If headers are not already sent, send a 500 status with an error message
    if (!res.headersSent) {
      res
        .status(500)
        .send("An error occurred while rendering the About Us page.");
    }
  }
};

// Controller for handling the items route
exports.getItems = (req, res, itemsDb, logger) => {
  // Fetch all items from the database
  itemsDb.find({}, (err, items) => {
    if (err) {
      // Log any error that occurs during fetching items
      logger.error("Error fetching items:", err);
      // Send a 500 status with the error message
      return res.status(500).send(err);
    }
    // Render the items page with the title "Items in Stock" and the fetched items
    res.render("items", { title: "Items in Stock", items: items });
    // Log the display of items
    logger.info("Displayed items");
  });
};
