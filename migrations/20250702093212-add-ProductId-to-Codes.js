'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.addColumn('Codes', 'ProductId', {
      type: Sequelize.INTEGER,
      references: {
        model: "Products",
        key: "id"
      },
      onUpdate: "cascade",
      onDelete: "cascade"
    })
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeColumn('Codes', 'ProductId');
  }
};
