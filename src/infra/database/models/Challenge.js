'use strict';
const Sequelize = require('sequelize');

module.exports = function(sequelize, DataTypes) {
  class Challenge extends Sequelize.Model {};
  Challenge.init({
    name: DataTypes.STRING,
    description: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'challenge'
  });

  Challenge.associate = (modules) => {
    modules.Challenge.belongsTo(modules.Provider);
    modules.Provider.hasMany(modules.Challenge);
  }

  return Challenge;
};
