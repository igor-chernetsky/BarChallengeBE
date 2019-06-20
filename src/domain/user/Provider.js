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
  logo: String,
  city: String,
  address: String,
  description: String,
  phone: String,
  status: String,
  images: Array,
  lat: Number,
  lng: Number
})(class Provider {});

module.exports = Provider;
