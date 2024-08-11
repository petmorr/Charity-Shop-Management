const NeDB = require("nedb");
const path = require("path");

const usersDb = new NeDB({
  filename: path.join(__dirname, "../data/users.db"),
  autoload: true,
});

// Function to add a new user
usersDb.addUser = (user, callback) => {
  usersDb.insert(user, callback);
};

// Function to find a user by username
usersDb.findUserByUsername = (username, callback) => {
  usersDb.findOne({ username }, callback);
};

// Function to find a user by ID
usersDb.findUserById = (id, callback) => {
  usersDb.findOne({ _id: id }, callback);
};

// Function to get all users
usersDb.getAllUsers = (callback) => {
  usersDb.find({}, callback);
};

// Function to delete a user by ID
usersDb.deleteUser = (id, callback) => {
  usersDb.remove({ _id: id }, {}, callback);
};

// Function to update a user's details
usersDb.updateUser = (id, updatedUser, callback) => {
  usersDb.update({ _id: id }, { $set: updatedUser }, {}, callback);
};

module.exports = usersDb;
