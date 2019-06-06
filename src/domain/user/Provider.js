const { attributes } = require('structure');

const Provider = attributes({
  id: Number,
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  address: String,
  description: String,
  phone: String,
  status: String
})(class Provider {});

module.exports = Provider;
