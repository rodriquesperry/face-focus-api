'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
	class User extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
		}
	}
	User.init(
		{
			id: {
				type: DataTypes.UUID,
				defaultValue: DataTypes.UUIDV4,
				primaryKey: true,
			},
			name: DataTypes.STRING,
			email: {
				type: DataTypes.STRING,
				unique: true,
			},
			entries: DataTypes.INTEGER,
			joined: DataTypes.DATE,
		},
		{
			sequelize,
			tableName: 'users',
			modelName: 'User',
			underscored: true,
		}
	);
	return User;
};
