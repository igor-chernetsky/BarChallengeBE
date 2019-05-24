const { attributes } = require('structure');

const Customer = attributes({
  id: Number,
  name: String,
  email: {
    type: String,
    required: true
  }
})(class Customer {});

module.exports = Customer;
