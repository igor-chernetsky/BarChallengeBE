const { attributes } = require('structure');

const Product = attributes({
  id: Number,
  name: String,
  provider: Object,
  description: String,
  image: String,
  isReward: Boolean,
  stepId: Number,
  status: String
})(class Product {});

module.exports = Product;