'use strict';

const dataFaker = require('src/infra/support/dataFaker');

module.exports = {
  up: function (queryInterface) {
    const testProviders = [];

    for(let i = 0; i < 20; i++) {
      testProviders.push({
        name: dataFaker.name(),
        email: dataFaker.email(),
        description: dataFaker.paragraph(),
        address: dataFaker.address(),
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }

    return queryInterface.bulkInsert('providers', testProviders, {});
  },

  down: function (queryInterface) {
    return queryInterface.bulkDelete('providers', null, {});
  }
};
