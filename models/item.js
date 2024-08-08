const NeDB = require('nedb');
const path = require('path');

const itemsDb = new NeDB({ filename: path.join(__dirname, '../data/items.db'), autoload: true });

module.exports = itemsDb;