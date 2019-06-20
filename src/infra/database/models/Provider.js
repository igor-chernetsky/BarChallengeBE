'use strict';
const Sequelize = require('sequelize');

module.exports = function(sequelize, DataTypes) {
  class Provider extends Sequelize.Model {};
  Provider.init({
    name: {type: DataTypes.STRING},
    email: {type: DataTypes.STRING},
    logo: {type: DataTypes.STRING},
    description: {type: DataTypes.STRING},
    city: {type: DataTypes.STRING},
    lat: {type: DataTypes.NUMBER},
    lng: {type: DataTypes.NUMBER},
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
