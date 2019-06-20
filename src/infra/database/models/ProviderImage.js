'use strict';
const Sequelize = require('sequelize');

module.exports = function(sequelize, DataTypes) {
  class ProviderImage extends Sequelize.Model {};
  ProviderImage.init({
    image: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'providerImage'
  });

  ProviderImage.associate = (modules) => {
    modules.Provider.hasMany(modules.ProviderImage);
    modules.ProviderImage.belongsTo(modules.Provider);
  }

  return ProviderImage;
};
