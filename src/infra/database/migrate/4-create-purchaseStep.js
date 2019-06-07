'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('purchaseSteps', {
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
      stepId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'steps',
          key: 'id'
        },
        onUpdate: 'cascade',
        onDelete: 'cascade'
      },
      purchaseId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'purchases',
          key: 'id'
        },
        onUpdate: 'cascade',
        onDelete: 'cascade'
      },
      challengeCustomerId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'challengeCustomers',
          key: 'id'
        },
        onUpdate: 'cascade',
        onDelete: 'cascade'
      }
    });
  },
  down: function(queryInterface) {
    return queryInterface.dropTable('purchaseStep');
  }
};
