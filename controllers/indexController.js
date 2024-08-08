exports.getAbout = (req, res, logger) => {
    try {
      res.render('about', { title: 'About Us' });
      logger.info('Accessed About Us page');
    } catch (error) {
      logger.error('Error rendering About Us page:', error);
      if (!res.headersSent) {
        res.status(500).send('An error occurred while rendering the About Us page.');
      }
    }
  };
  
  exports.getItems = (req, res, itemsDb, logger) => {
    itemsDb.find({}, (err, items) => {
      if (err) {
        logger.error('Error fetching items:', err);
        return res.status(500).send(err);
      }
      res.render('items', { title: 'Items in Stock', items: items });
      logger.info('Displayed items');
    });
};