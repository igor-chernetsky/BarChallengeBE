const { attributes } = require('structure');

const Product = attributes({
  id: Number,
  name: String,
  provider: Object
})(class Product {});

module.exports = Product;