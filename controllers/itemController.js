const { validationResult } = require('express-validator');

exports.getManageItems = (req, res, itemsDb, logger) => {
  if (!req.session.user) {
    logger.warn('Unauthorized access to manage items by user:', { user: req.session.user });
    return res.status(403).json({ error: 'Unauthorized access' });
  }

  const query = req.session.user.role === 'manager' ? {} : { owner: req.session.user.username };

  itemsDb.find(query, (err, items) => {
    if (err) {
      logger.error('Error loading items:', err);
      return res.status(500).json({ error: 'Failed to load items. Please try again.' });
    }
    logger.info('Displayed manage items page');
    return res.status(200).json({ items });
  });
};

exports.postAddItem = (req, res, itemsDb, logger) => {
  if (!req.session.user) {
    logger.warn('Unauthorized add attempt by user:', { user: req.session.user });
    return res.status(403).json({ error: 'Unauthorized access' });
  }

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    logger.warn('Validation errors on add item:', { errors: errors.array() });
    return res.status(400).json({ error: 'Validation failed', details: errors.array() });
  }

  const newItem = {
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
    store: req.body.store,
    image: req.file ? `/uploads/${req.file.filename}` : '',
    owner: req.session.user.username
  };

  itemsDb.insert(newItem, (err, newDoc) => {
    if (err) {
      logger.error('Failed to add item:', err);
      return res.status(500).json({ error: 'Failed to add item. Please try again.' });
    }
    logger.info('Item added successfully:', { newDoc });
    return res.status(201).json({ message: 'Item added successfully' });
  });
};

exports.deleteItem = (req, res, itemsDb, logger) => {
  if (!req.session.user) {
    logger.warn('Unauthorized delete attempt by user:', { user: req.session.user });
    return res.status(403).json({ error: 'Unauthorized access' });
  }

  const itemId = req.params.id;
  const query = req.session.user.role === 'manager' ? { _id: itemId } : { _id: itemId, owner: req.session.user.username };

  itemsDb.remove(query, {}, (err, numRemoved) => {
    if (err || numRemoved === 0) {
      logger.error('Failed to delete item:', { itemId, err });
      return res.status(500).json({ error: 'Failed to delete item. Please try again.' });
    }
    logger.info('Item deleted successfully:', { itemId });
    return res.status(200).json({ message: 'Item deleted successfully' });
  });
};

exports.getEditItem = (req, res, itemsDb, logger) => {
  if (!req.session.user) {
    logger.warn('Unauthorized edit attempt by user:', { user: req.session.user });
    return res.status(403).json({ error: 'Unauthorized access' });
  }

  const itemId = req.params.id;
  const query = req.session.user.role === 'manager' ? { _id: itemId } : { _id: itemId, owner: req.session.user.username };

  itemsDb.findOne(query, (err, item) => {
    if (err || !item) {
      logger.error('Error loading item:', { itemId, err });
      return res.status(500).json({ error: 'Failed to load item. Please try again.' });
    }
    logger.info('Displayed edit item page for item:', { item });
    return res.status(200).json({ item });
  });
};

exports.postEditItem = (req, res, itemsDb, logger) => {
  if (!req.session.user) {
    logger.warn('Unauthorized edit attempt by user:', { user: req.session.user });
    return res.status(403).json({ error: 'Unauthorized access' });
  }

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    logger.warn('Validation errors on edit item:', { errors: errors.array() });
    return res.status(400).json({ error: 'Validation failed', details: errors.array() });
  }

  const itemId = req.params.id;
  const updatedItem = {
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
    store: req.body.store,
    image: req.file ? `/uploads/${req.file.filename}` : req.body.existingImage
  };

  const query = req.session.user.role === 'manager' ? { _id: itemId } : { _id: itemId, owner: req.session.user.username };

  itemsDb.update(query, { $set: updatedItem }, {}, (err, numReplaced) => {
    if (err || numReplaced === 0) {
      logger.error('Failed to update item:', { itemId, err });
      return res.status(500).json({ error: 'Failed to update item. Please try again.' });
    }
    logger.info('Item updated successfully:', { itemId, updatedItem });
    return res.status(200).json({ message: 'Item updated successfully' });
  });
};