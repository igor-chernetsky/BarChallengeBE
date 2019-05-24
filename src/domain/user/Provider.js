const { attributes } = require('structure');

const Provider = attributes({
  id: Number,
  name: {
    type: String,
    required: true
  },
  logo: String,
  description: String,
  address: String,
  email: {
    type: String,
    required: true
  },
  phone: String,
  status: String
})(class Provider {});

module.exports = Provider;
