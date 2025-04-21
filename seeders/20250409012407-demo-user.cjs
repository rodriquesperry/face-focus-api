'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		return queryInterface.bulkInsert('Users', [
			{
				id: '123',
				name: 'John',
				email: 'john@mail.com',
				entries: 0,
				joined: new Date(),
				created_at: new Date(),
				updated_at: new Date(),
			},
			{
				id: '124',
				name: 'Sally',
				email: 'sally@mail.com',
				entries: 0,
				joined: new Date(),
				created_at: new Date(),
				updated_at: new Date(),
			},
		]);
	},

	async down(queryInterface, Sequelize) {
		/**
		 * Add commands to revert seed here.
		 *
		 * Example:
		 * await queryInterface.bulkDelete('People', null, {});
		 */
	},
};
