'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('BorrowedBooks', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      memberCode: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: 'Members',
          key: 'code'
        }
      },
      bookCode: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: 'Books', 
          key: 'code'
        }
      },
      borrowedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      },
      maxReturnAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      returnedAt: {
        type: Sequelize.DATE,
        allowNull: true
      },
      status: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'borrowed'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      }
    });

    // Add foreign key constraints
    await queryInterface.addConstraint('BorrowedBooks', {
      fields: ['memberCode'],
      type: 'foreign key',
      name: 'fk_borrowedbooks_membercode',
      references: {
        table: 'Members',
        field: 'code'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });

    await queryInterface.addConstraint('BorrowedBooks', {
      fields: ['bookCode'],
      type: 'foreign key',
      name: 'fk_borrowedbooks_bookcode',
      references: {
        table: 'Books',
        field: 'code'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('BorrowedBooks');
  }
};
