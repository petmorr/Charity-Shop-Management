const NeDB = require("nedb");
const path = require("path");

const itemsDb = new NeDB({
  filename: path.join(__dirname, "../data/items.db"),
  autoload: true,
});

// Function to add a new item
itemsDb.addItem = (item, callback) => {
  itemsDb.insert(item, callback);
};

// Function to find an item by its ID
itemsDb.findItemById = (id, callback) => {
  itemsDb.findOne({ _id: id }, callback);
};

// Function to update an item by its ID
itemsDb.updateItem = (id, updatedItem, callback) => {
  itemsDb.update({ _id: id }, { $set: updatedItem }, {}, callback);
};

// Function to delete an item by its ID
itemsDb.deleteItem = (id, callback) => {
  itemsDb.remove({ _id: id }, {}, callback);
};

// Function to get all items
itemsDb.getAllItems = (callback) => {
  itemsDb.find({}, callback);
};

// Function to find items by store
itemsDb.findItemsByStore = (store, callback) => {
  itemsDb.find({ store }, callback);
};

// Function to find items by owner
itemsDb.findItemsByOwner = (owner, callback) => {
  itemsDb.find({ owner }, callback);
};

module.exports = itemsDb;
