'use strict';
const Sequelize = require('sequelize');

module.exports = function(sequelize, DataTypes) {
  class Provider extends Sequelize.Model {};
  Provider.init({
    name: {type: DataTypes.STRING},
    email: {type: DataTypes.STRING},
    logo: {type: DataTypes.STRING},
    description: {type: DataTypes.STRING},
    address: {type: DataTypes.STRING},
    phone: {type: DataTypes.STRING},
    status: {type: DataTypes.STRING},
    passwordHash: {type: DataTypes.STRING}
  }, {
    sequelize,
    modelName: 'provider'
  });

  return Provider;
};
