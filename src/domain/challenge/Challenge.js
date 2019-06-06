const { attributes } = require('structure');

const Challenge = attributes({
  id: Number,
  name: String,
  provider: Object,
  products: Array
})(class Challenge {});

module.exports = Challenge;