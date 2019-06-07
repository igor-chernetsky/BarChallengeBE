'use strict';
const Sequelize = require('sequelize');

module.exports = function(sequelize, DataTypes) {
  class ChallengeCustomer extends Sequelize.Model {};
  ChallengeCustomer.init({
    rewardId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Product',
        key: 'id'
      }
    }
  }, {
    sequelize,
    modelName: 'challengeCustomer'
  });

  ChallengeCustomer.associate = (modules) => {
    modules.Challenge.hasMany(modules.ChallengeCustomer);
    modules.ChallengeCustomer.belongsTo(modules.Challenge);
    modules.Customer.hasMany(modules.ChallengeCustomer);
    modules.ChallengeCustomer.belongsTo(modules.Customer);
  }

  return ChallengeCustomer;
};
