'use strict';

module.exports = function(sequelize, DataTypes) {
  const Product = sequelize.define('product', {
    name: DataTypes.STRING,
    image: DataTypes.STRING,
    description: DataTypes.STRING
  }, {
    classMethods: {
      associate(modules) {
        modules.Product.belongsTo(modules.Provider);
        modules.Provider.hasMany(modules.Product);
      }
    }
  });

  return Product;
};
