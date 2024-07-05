'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Members', [
      {
          code: "M001",
          name: "Angga",
          status: "Active",
          createdAt: new Date(),
          updatedAt: new Date()
      },
      {
          code: "M002",
          name: "Ferry",
          status: "Active",
          createdAt: new Date(),
          updatedAt: new Date()
      },
      {
          code: "M003",
          name: "Putri",
          status: "Active", 
          createdAt: new Date(),
          updatedAt: new Date()
      },
  ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Members', null, {});
  }
};
