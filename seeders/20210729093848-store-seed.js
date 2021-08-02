'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Stores',
      ['博客來', '灰熊愛讀書', '蝦皮書城'].map((item, index) =>
      ({
        id: (index * 2 + 1) * 5,
        name: item,
        createdAt: new Date(),
        updatedAt: new Date()
      })
      ), {})
  },

  down: async (queryInterface, Sequelize) => {
    queryInterface.bulkDelete('Stores', null, {})
  }
};
