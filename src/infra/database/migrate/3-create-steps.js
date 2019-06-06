'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('steps', {
      id: {
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
      productId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'products',
          key: 'id'
        },
        onUpdate: 'cascade',
        onDelete: 'SET NULL'
      },
      challengeId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'challenges',
          key: 'id'
        },
        onUpdate: 'cascade',
        onDelete: 'SET NULL'
      },
      isReward: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      }
    });
  },
  down: function(queryInterface) {
    return queryInterface.dropTable('steps');
  }
};
