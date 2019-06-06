'use strict';
const Sequelize = require('sequelize');

module.exports = function(sequelize, DataTypes) {
  class Product extends Sequelize.Model {};
  Product.init({
    name: DataTypes.STRING,
    image: DataTypes.STRING,
    description: DataTypes.STRING,
    deleted: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'product'
  });

  Product.associate = (modules) => {
    modules.Provider.hasMany(modules.Product);
    modules.Product.belongsTo(modules.Provider);
  }

  return Product;
};
