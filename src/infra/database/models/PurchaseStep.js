'use strict';
const Sequelize = require('sequelize');

module.exports = function(sequelize, DataTypes) {
  class PurchaseStep extends Sequelize.Model {};
  PurchaseStep.init({
  }, {
    sequelize,
    modelName: 'purchaseStep'
  });

  PurchaseStep.associate = (modules) => {
    modules.Step.hasMany(modules.PurchaseStep);
    modules.PurchaseStep.belongsTo(modules.Step);
    modules.Purchase.hasMany(modules.PurchaseStep);
    modules.PurchaseStep.belongsTo(modules.Purchase);
    modules.ChallengeCustomer.hasMany(modules.PurchaseStep);
    modules.PurchaseStep.belongsTo(modules.ChallengeCustomer);
  }

  return PurchaseStep;
};
