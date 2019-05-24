'use strict';

module.exports = function(sequelize, DataTypes) {
  const Provider = sequelize.define('provider', {
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    logo: DataTypes.STRING,
    description: DataTypes.STRING,
    phone: DataTypes.STRING,
    status: DataTypes.STRING,
    passwordHash: DataTypes.STRING
  }, {
    classMethods: {
      associate() {
        // associations can be defined here
      }
    }
  });

  return Provider;
};
