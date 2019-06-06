'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('challengeCustomers', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      stepsLeft: {
        type: Sequelize.ARRAY(Sequelize.INTEGER)
      },
      customerId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'customers',
          key: 'id'
        },
        onUpdate: 'cascade',
        onDelete: 'cascade'
      },
      challengeId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'challenges',
          key: 'id'
        },
        onUpdate: 'cascade',
        onDelete: 'cascade'
      },
      rewardId: {
        type: Sequelize.INTEGER
      }
    });
  },
  down: function(queryInterface) {
    return queryInterface.dropTable('challengeCustomers');
  }
};
