const { attributes } = require('structure');

const Purchase = attributes({
  id: Number,
  customerId: Number,
  product: Object,
  createdAt: Date
})(class Product {});

module.exports = Purchase;