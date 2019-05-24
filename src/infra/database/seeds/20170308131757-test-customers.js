'use strict';

const dataFaker = require('src/infra/support/dataFaker');

module.exports = {
  up: function (queryInterface) {
    const testCustomers = [];

    for(let i = 0; i < 20; i++) {
      testCustomers.push({
        name: dataFaker.name(),
        email: dataFaker.email(),
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }

    return queryInterface.bulkInsert('customers', testCustomers, {});
  },

  down: function (queryInterface) {
    return queryInterface.bulkDelete('customers', null, {});
  }
};
