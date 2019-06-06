'use strict';
const Sequelize = require('sequelize');

module.exports = function(sequelize, DataTypes) {
  class Customer extends Sequelize.Model {};
  Customer.init({
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    phone: DataTypes.STRING,
    passwordHash: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'customer'
  });

  return Customer;
};
