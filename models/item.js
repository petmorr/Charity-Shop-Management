const NeDB = require("nedb");
const path = require("path");

const itemsDb = new NeDB({
  filename: path.join(__dirname, "../data/items.db"),
  autoload: true,
});

// Function to add a new item
exports.addItem = (item, callback) => {
  itemsDb.insert(item, callback);
};

// Function to find an item by its ID
exports.findItemById = (id, callback) => {
  itemsDb.findOne({ _id: id }, callback);
};

// Function to update an item by its ID
exports.updateItem = (id, updatedItem, callback) => {
  itemsDb.update({ _id: id }, { $set: updatedItem }, {}, callback);
};

// Function to delete an item by its ID
exports.deleteItem = (id, callback) => {
  itemsDb.remove({ _id: id }, {}, callback);
};

// Function to get all items
exports.getAllItems = (callback) => {
  itemsDb.find({}, callback);
};

module.exports = itemsDb;
