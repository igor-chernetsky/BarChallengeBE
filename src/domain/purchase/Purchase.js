const { attributes } = require('structure');

const Purchase = attributes({
  id: Number,
  customer: Object,
  product: Object,
  createdDate: Date
})(class Product {});

module.exports = Purchase;