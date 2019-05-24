'use strict';

module.exports = function(sequelize, DataTypes) {
  const Customer = sequelize.define('customer', {
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    phone: DataTypes.STRING,
    passwordHash: DataTypes.STRING
  }, {
    classMethods: {
      associate() {
        // associations can be defined here
      }
    }
  });

  return Customer;
};
