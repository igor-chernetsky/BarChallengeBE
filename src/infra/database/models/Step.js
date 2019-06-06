'use strict';
const Sequelize = require('sequelize');

module.exports = function(sequelize, DataTypes) {
  class Step extends Sequelize.Model {};
  Step.init({
    isReward: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    sequelize,
    modelName: 'step'
  });

  Step.associate = (modules) => {
    modules.Challenge.hasMany(modules.Step);
    modules.Step.belongsTo(modules.Challenge);
    modules.Product.hasMany(modules.Step);
    modules.Step.belongsTo(modules.Product);
  }

  return Step;
};
