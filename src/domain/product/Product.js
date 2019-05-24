const { attributes } = require('structure');
const Provider = require('./user/Provider');

const Product = attributes({
  id: Number,
  name: String,
  image: String,
  description: String,
  provider: Provider,
  status: String
})(class Customer {});

module.exports = Customer;