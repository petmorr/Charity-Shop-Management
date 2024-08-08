const NeDB = require('nedb');
const path = require('path');

const usersDb = new NeDB({ filename: path.join(__dirname, '../data/users.db'), autoload: true });

module.exports = usersDb;