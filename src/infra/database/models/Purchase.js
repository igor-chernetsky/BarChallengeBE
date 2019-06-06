'use strict';
const Sequelize = require('sequelize');

module.exports = function(sequelize, DataTypes) {
  class Purchase extends Sequelize.Model {};
  Purchase.init({
  }, {
    sequelize,
    modelName: 'purchase'
  });
  Purchase.associate = (modules) => {
    modules.Customer.hasMany(modules.Purchase);
    modules.Purchase.belongsTo(modules.Customer);
    modules.Product.hasMany(modules.Purchase);
    modules.Purchase.belongsTo(modules.Product);
  }

  return Purchase;
};
